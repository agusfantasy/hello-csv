## Hello CSV

The backlog is as folows:

0. Read the file (sample.csv).
1. Parse the loaded csv.
2. For each line do transfomation for `first_name` and `last_name` into `full_name`, hence we'll have `full_name` for each line.
3. Send the transformed line via SMS. (see [helper.js](https://github.com/HOOQsters/hello-csv/blob/master/helper.js)) 
4. Log the SMS sending status result to S3. (see [helper.js](https://github.com/HOOQsters/hello-csv/blob/master/helper.js))

### Discussion

- What do you think about the [`naive()`](https://github.com/HOOQsters/hello-csv/blob/master/parse-callback.js#L11) function?
- Please take a peek at the [parse-async.js](https://github.com/HOOQsters/hello-csv/blob/master/parse-async.js), [parse-stream.js](https://github.com/HOOQsters/hello-csv/blob/master/parse-stream.js) and [parse-promise.js](https://github.com/HOOQsters/hello-csv/blob/master/parse-promise.js), then give your best gift to us! (Yes, sending us a [proper PR](https://help.github.com/articles/creating-a-pull-request/))

**Constraint**: Please use async API only e.g. `fs.readFile` **NOT** `fs.readFileSync` for reading files.

**Note**: The [`sendSms`](https://github.com/HOOQsters/hello-csv/blob/master/helper.js#L17) and [`logToS3`](https://github.com/HOOQsters/hello-csv/blob/master/helper.js#L29) have surprises, please deal with that.

Ah, yes, one last thing, please use http://jscs.info/ to make your code consistent.

Have fun!


### Answer about naive
That's so naive function. 
- callback chaining, which is not good because there are four asyncronous, the code is not readability and not clean, and can't run parallel, would be better use promise or async
- "for", looping array data by "for" is lower then forEach, or it can be use async.forEachOf.
