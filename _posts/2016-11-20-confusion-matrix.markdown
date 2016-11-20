---
layout: post
title: "Confusion Matrix"
date: 2016-11-20 08:10:00 +0700
category: machine-learning
comments: true
---
As one of the beginnings of machine learning course in the office, it's important to know what are the metrics that we need to observe to define our machine learning model.
**Accuracy** and **Precision** are the examples. But how can we measure the metrics? Then, we need to prepare our [**Confusion Matrix**](https://en.wikipedia.org/wiki/Confusion_matrix){:target="_blank"}.

One of the stages in building the model is to **test* the model's prediction against the actual data. Suppose that our test result is like this:

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
  This metric will tell you how good the model is in predicting the **true prediction**.

    ```
    Precision = No. of True Positive / (No. of True Positive + No. of False Positive)
    ```

    In our case, the model precision will be: `4 / (4 + 2) = 0. 667`

That's all folks, I hope it's useful. :)
