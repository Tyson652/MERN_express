const supertest = require("supertest");
const app = require("../../app");

describe("POST /profile/avatar-upload - upload a new avatar image to AWS-S3", () => {
  // const filePath = `${__dirname}/testFiles/test.pdf`;
  // it("should upload the test file to AWS-S3", async () => {
  //   const response = supertest(app)
  //     .post("/profile/avatar-upload")
  //     // Attach the file with key 'file' which is corresponding to your endpoint setting.
  //     .attach("image", filePath)
  //     .then(res => {
  //       const { success, message, filePath } = res.body;
  //       expect(success).toBeTruthy();
  //       // expect(message).toBe('Uploaded successfully');
  //       // expect(typeof filePath).toBeTruthy();
  //     })
  //     .catch(err => console.log(err));
  // });
});
