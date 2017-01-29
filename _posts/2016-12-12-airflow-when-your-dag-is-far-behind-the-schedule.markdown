---
layout: post
title: "Airflow: When Your DAG is Far Behind The Schedule"
date: 2016-12-12 08:00:00 +0700
category: airflow
---
[Airflow](http://nerds.airbnb.com/airflow/){:target="_blank"} is a workflow management tool built by [Airbnb](http://airbnb.io){:target="_blank"}. This open source project has been a very important tool in our organisation.
At first, we used that only for our ETL, but now we've expanded its usage to almost all scheduled jobs that we have.

The power of this tool are its capability to schedule jobs and make the execution distributable across instances. When we're talking about schedule,
sometimes we have to deal with unexpected problems that affecting the job's schedule. It's relatively okay when the job is behind schedule for the unit of minutes,
but what if it's left behind for hours or even days? It's frustrating. We're aware that there's no easy way to deal with this situation, it still requires effort and time.
So, this time, I would like to share about our effort to, at least, make it less painful.

### Airflow components

To give you a little bit of context, airflow actually have so many important components,
but to simplify my explanation I will only talk about **DAG**, **Task Instance**, **Scheduler**, **Worker**.

> Imagine that you have **a group of processes** running in the background and **scheduled in every 5 minutes**.
> However, with 1 instance, you don't have enough resources to execute all of the processes,
> so you decided to make it scalable by **executing certain processes in certain instances**.

That actually summarise all about the 4 terminologies.
The **group of processes** is known as **DAG ([Directed Acyclic Graph](https://en.wikipedia.org/wiki/Directed_acyclic_graph){:target="_blank"})** and each of process is known as **task instance**.
On the other part of the system, airflow has a scheduler that actively create a schedule for a DAG to execute all of its task instances which is known as **[airflow scheduler](https://airflow.incubator.apache.org/scheduler.html){:target="_blank"}**.
The part of airflow that allow us to execute programs remotely is known as **airflow worker**.

Below is the example of a DAG contains so many task instances and designed in quite complex manner.

<div class="img_row">
  <a href="http://nerds.airbnb.com/wp-content/uploads/2015/06/Screen-Shot-2015-05-28-at-11.13.01-AM.png" target="_blank">
    <img class="col three" src="http://nerds.airbnb.com/wp-content/uploads/2015/06/Screen-Shot-2015-05-28-at-11.13.01-AM.png">
  </a>
</div>
<div class="col three caption">
  Example of DAG
</div>

If you want to have a deeper knowledge about airflow, you can go to [this page](https://airflow.incubator.apache.org/concepts.html){:target="_blank"}.

### How do we use airflow?

As I mentioned earlier, we mainly use this platform to execute our ETL.
At first, our ETLs were registered as cron jobs. However, we found it hard to manage and monitor the status of the jobs.
We had 2 options at the time, they were **airflow** (this was our CTO's suggestion) and **[luigi](https://github.com/spotify/luigi){:target="_blank"}**.
Thus, we decided to use airflow because it could fulfill what we needed and then, we moved all of our ETLs from cron jobs to a few of DAGs.

Fast forward to present days, now we have **46 DAGs** with ratio **1.86 task instance** per DAG. Very low, isn't it?
Yes, we learnt from the past that complex DAG would bring unnecessary problem which I will explain in the other section.

Not only for ETL, now we use it for any processes that should run with schedule like data synchronisation, data archiving, mail reporter, etc.

We also made it scalable by utilising the **airflow worker**. It relies on [celery](http://www.celeryproject.org){:target="_blank"} as a message channel between instances.
With that, we have **4 instances** to work on all of our tasks under those 46 DAGs.

### Why do I get a DAG behind the actual schedule?

The main task of **airflow scheduler** is to create a **DAG run**. **DAG run** will create a record that allow the task executor to know that it can execute the tasks, otherwise the worker will do nothing.
So, what will happen if a DAG run is marked as **fail**? Well, it depends on your DAG configuration.

When you write your DAG, you need to provide `depends_on_past` config that receives `boolean` object. Therefore, when you set it with `True`, your next DAG run will always be marked as fail and that we call it as **deadlock** state.
But, when you set it with `False`, it will ignore the previous DAG run state. To get a complete list of airflow API, please visit [this page](https://airflow.incubator.apache.org/code.html){:target="_blank"}

And then you might ask a question: in which condition should we set it to `True` or `False`? Good question and I do have the answer, but not this time. I'll answer that in the other post.

Let's look at the condition where you set your `depends_on_past` with `True` and you get into a deadlock state. There are a lot of reasons as to the cause of the failure.
It could be your code are crappy. It could be there's something wrong with your database. It could be your data stream system just ingested a very bad form of data. And many more!

Sometimes right after you fix it, your scheduler just have made dozens of DAG runs. This is the situation where your DAG schedule is left behind the actual schedule.
So, should I just wait for it to catch up with the schedule? You can do that, but I don't recommend it if your DAG is far behind the schedule. 

So, what would I do then?

### Let's accelerate the DAG run execution!

Let's say, I have a DAG named `users_etl` that contains only 1 task. The task goal is to aggregate the user information based on **time** and **platform**. It's scheduled to be executed in every **5 minutes**.
One day, my DAG was scheduled to run at 12:00 PM, but then marked as fail for some reasons.
Of course, when it failed, I received the alert and immediately took an action.
However, by the time I fixed the program, the DAG should have executed the schedule for 02:00 PM. This means that I need to catch up 24 schedules.
If I just let it catches the schedule by itself, it might need around 72 minutes to get to 02:00 PM, because it needs around 3 minutes to finish a DAG run.
In other words, if I do nothing to accelerate the process, it will need roughly almost 3 hours to catch up with the schedule.

Instead of waiting for a very long time, I did this to my DAG.

1. Turn off the scheduler for `users_etl`.

2. Since the DAG is in deadlock state, I need to delete all of DAG runs from 12:00 PM to 02:00 PM. You can do this on airflow web interface or directly from the database.

3. Execute the task manually to fulfill the task from 12:00 PM to 02:00 PM. This is why it's important to allow your script to receive start time and end time.
So, if your task is written in ruby, you should be able to execute it like this: `RAILS_ENV=production bin/rake etl:users['2016-12-10 12:00:00','2016-12-10 14:00:00']`.

4. Run an airflow backfill command like this:
`airflow backfill -m -s "2016-12-10 12:00" -e "2016-12-10 14:00" users_etl`.
This command will create task instances for all schedule from 12:00 PM to 02:00 PM and mark it as **success** without executing the task at all.
Ensure that you set your `depends_on_past` config to `False`, it will make this process a lot faster. When you're done with it, set it back to `True`.

5. The previous action left us without any record on DAG run. Therefore, we need to create a DAG run record and mark it as **success**.
We only need to create one DAG run record and it's the last one, the schedule for 02:00 PM. It's because airflow `depends_on_past` only look at the previous DAG run state.
To create the record, you can do it from airflow web interface.

6. Turn on the scheduler.

I understand that to do those steps also require some amount of time, but it's still a lot less than waiting for it catches the schedule by itself.

### Advices

Airflow is a great tool with important features to manage scheduled jobs and I found it very useful for us.
Despite of some challenges that we faced when using airflow, I think it's one of many ways to master the tool.

Here are some advices to have a good experience with airflow:

1. Don't build a fat and complex DAG.  
It's similar to [single responsibility principle](https://en.wikipedia.org/wiki/Single_responsibility_principle){:target="_blank"}.
It's better to group your task instances based on a very specific concern or purpose, and this is the reason why we only have 1.86 ratio task instances per DAG.
This is very important because, in a DAG, when 1 task fail, it will affect the schedule for other unrelated tasks. For an example, to simplify thing you put all of your etl tasks under 1 DAG.
What will happen is when users etl task fail, the schedule will stop creating DAG runs for articles etls, as well.
Since there's nothing that make users and articles tightly coupled, so users etl and articles etl should exist in a different DAG.

2. Set your `max_active_runs` to 1.  
By default, scheduler is allowed to schedule up to 16 DAG runs ahead of actual DAG run. This usually happen if the task execution is taking time longer than expected.
In our case, to allow scheduler to create up to 16 DAG runs, sometimes lead to an even longer delay of task execution. Since most of our DAGs have `depends_on_past` set with `True`,
we think it's unnecessary to have so many future schedules, so we set the `max_active_runs` config to 1. After that, the task execution delay is lower than before we set it.

3. Put priority weight for important tasks.  
From all of our task instances, we have some that we think are more important than other task instances. So, to make airflow task executor aware of this sense of priority,
it allows us to set `priority_weight` (`integer` value) in DAG configuration. The default value is 0, so you need to set it higher for more important task instances.

Hopefully those are some good advices and valuable for you. Have a good day!

---

*I should thank [Rencana Tarigan](https://www.linkedin.com/in/rencanatarigan){:target="_blank"} and [Septian Hari Nugroho](https://github.com/liqrgv){:target="_blank"} for their experiment with the airflow backfill command.
Thanks, guys!*
