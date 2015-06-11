describe('Route Optimizer', function() {
  it('should have a Title', function() {
    browser.get('http://localhost:8080');

    expect(browser.getTitle()).toEqual('Schedule Optimizer');
  });
});
describe('Route Optimizer', function() {
  it('should add a employee to database', function() {
    browser.get('http://localhost:8080/manage?');
    element(by.model('add1')).sendKeys(1);
    element(by.model('add2')).sendKeys(2);

	element(by.id('plus')).click();	
	expect(element(by.id('result')).getAttribute('value') ).toEqual('8192');
  });
});