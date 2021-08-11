const queries = require('./queries/queries.ts')

const {compareData, hash} = require('./compare-data')

expect.extend({
  ToBeMatch(expect, toBe, Msg) {
    //Msg is the message you pass as parameter
    const pass = expect === toBe;
    if (pass) {
      //pass = true its ok
      return { pass: pass }
    } else {
      //not pass
      return { pass: pass, message: () => Msg }
    }
  }
});

test("Test for activity table should be successful", async () => {
  const {inputData, outputData, msg} = await compareData("activities.csv", queries.selectFromActivities)
  expect(inputData).ToBeMatch(outputData, msg);
});

test("Test for notification table should be successful", async () => {
  const {inputData, outputData, msg} = await compareData("notifications.csv", queries.selectFromNotifications)
  expect(inputData).ToBeMatch(outputData, msg);
});

test("Test for news_feed table should be successful", async () => {
  const {inputData, outputData, msg} = await compareData("news_feed.csv", queries.selectFromNewsFeed)
  expect(inputData).ToBeMatch(outputData, msg);
});

test("Test for account_followers table should be successful", async () => {
  const {inputData, outputData, msg} = await compareData("account_followers.csv", queries.selectFromAccountFollowers)
  expect(inputData).ToBeMatch(outputData, msg);
});

test("Test for comment_followers table should be successful", async () => {
  const {inputData, outputData, msg} = await compareData("comment_followers.csv", queries.selectFromCommentFollowers)
  expect(inputData).ToBeMatch(outputData, msg);
});

test("Test for product_followers table should be successful", async () => {
  const {inputData, outputData, msg} = await compareData("product_followers.csv", queries.selectFromProductFollowers)
  expect(inputData).ToBeMatch(outputData, msg);
});

test("Test for storefront_folowers table should be successful", async () => {
  const {inputData, outputData, msg} = await compareData("storefront_followers.csv", queries.selectFromStorefrontFollowers)
  expect(inputData).ToBeMatch(outputData, msg);
});