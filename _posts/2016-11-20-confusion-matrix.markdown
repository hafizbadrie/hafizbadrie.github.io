---
layout: post
title: "Confusion Matrix"
date: 2016-11-20 08:10:00 +0700
category: machine-learning
---
As one of the beginning steps in machine learning, it's important to know what are the metrics that we need to observe to measure our machine learning model's performance.
**Accuracy** and **Precision** are the examples. But how can we measure the metrics? 
Let's prepare our [**Confusion Matrix**](https://en.wikipedia.org/wiki/Confusion_matrix){:target="_blank"}.

One of the stages in building the model is to **test** the model's prediction against the actual data. Suppose that our test result is like this:

|------------|---|---|---|---|---|---|---|---|
| Prediction | 1 | 0 | 1 | 0 | 1 | 1 | 1 | 1 |
|------------|---|---|---|---|---|---|---|---|
| Actual     | 1 | 1 | 1 | 0 | 0 | 1 | 0 | 1 |

We can transform the table into another form of table that we call **confusion matrix**.

<table>
  <tr>
    <td colspan="2" rowspan="2"></td>
    <td colspan="2">Prediction</td>
  </tr>
  <tr>
    <td>0</td>
    <td>1</td>
  </tr>
  <tr>
    <td rowspan="2">Actual</td>
    <td>0</td>
    <td>1</td>
    <td>2</td>
  </tr>
  <tr>
    <td>1</td>
    <td>1</td>
    <td>4</td>
  </tr>
</table>

To easily describe the situation from above table, these are the terminologies commonly used:

1. **True Negative**  
  When our model *predict* that it is 0, and the *actual* data says it is also 0.

2. **False Positive**  
  When our model *predict* that it is 1, while the *actual* data says it is 0.

3. **False Negative**  
  When our model *predict* that it is 0, while the *actual* data says it is 1.

4. **True Positive**  
  When our model *predict* that it is 1, and the *actual* data says it is also 1.

Above terminologies are actually very helpful for us to get a better understanding as to what actually the metrics are trying to measure.
Since we already have the result of the test, now it's time for the metrics.

1. **Accuracy**  
  This is actually the total portion of model's correct prediction.

    ```
    Accuracy = (No. of True Positive + No. of True Negative) / Total Prediction
    ```

    In our case, the model accuracy will be: `5 / 8 = 0.625`

2. **Precision**  
  This metric will tell you how good the model is in predicting the correct **true prediction**.

    ```
    Precision = No. of True Positive / (No. of True Positive + No. of False Positive)
    ```

    In our case, the model precision will be: `4 / (4 + 2) = 0. 667`.
    So if we have a spam detection system with precision **0.667**,
    we can conclude that **every time the system says it's a spam**, then 66.7% of the time, the prediction is correct.

3. **Recall (Sensitivity)**  
  This metric will tell you how good the model is in predicting the **positives** data.

    ```
    Recall = No. of True Positive / (No. of True Positive + No. of False Negative)
    ```

    In our case, the model recall will be: `4 / (4 + 1) = 0.8`.
    If our spam detection system has a recall **0.8**,
    we can conclude that if we have actual datasets consiting of 100 spam comments and 200 ham comments,
    then potentially it could only detect 80 spam comments (80% probability) out of 100 spam comments.

4. **Specificity**  
  This metric will tell you how good the model is in predicting the **negatives** data.

    ```
    Specificity = No. of True Negative / (No. of True Negative + No. of False Positive)
    ```

    In our case, the modell specificity will be: `1 / (1 + 2) = 0.33`.
    If our spam detection system has a specifity **0.33**,
    we can conclude that if we have actual datasets consiting of 100 spam comments and 200 ham comments,
    then potentially it could only detect 66 ham comments (33% probability) out of 200 ham comments.

    With that kind of performance, I can't imagine how big the false alarm will be for the system owner. :)

Aside from those 4 metrics, there are actually 2 metrics more like **F-Measure** and **B-Acc**. However, I won't cover it in this post,
as I'm still trying to undestand it comprehensively.

## Try It Out

I think it will be very interesting if we can practice it with a bigger dataset.
So, let's practice our understanding about those 4 metrics with [this data](http://hafizbadrie.com/archives/2016/11/test-result.csv){:target="_blank"}.
This is [my result](http://hafizbadrie.com/archive/2016/11/confusion-matrix.csv){:target="_blank"}. What's yours?

*(Thanks to [Fajri Koto](https://www.linkedin.com/in/fajri-koto-02705860){:target="_blank"} and [Yahya Eru Cakra](https://www.linkedin.com/in/erocakra){:target="_blank"} for letting me use their presentation and data as the main source of this post)*

That's all folks, I hope it's useful. :)

