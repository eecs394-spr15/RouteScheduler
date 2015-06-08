describe('Route Optimizer', function() {
  it('should upload', function() {
    browser.get('http://localhost:8080');

    expect(browser.getTitle()).toEqual('Schedule Optimizer');
  });
});
