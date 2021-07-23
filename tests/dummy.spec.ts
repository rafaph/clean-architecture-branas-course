import sinon from "sinon";

class MyClass {
  public myMethod1(): number {
    return 123;
  }

  public myMethod2(): number {
    return this.myMethod1();
  }
}

describe("dummy tests", () => {
  it("is a dummy test", () => {
    const instance = new MyClass();
    sinon.stub(instance, "myMethod1").callsFake(() => 200);
    expect(instance.myMethod2()).to.be.equal(200);
  });
});
