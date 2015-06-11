describe('Route Optimizer', function() {

  var startCount;

  beforeEach(function() {
    browser.get('http://localhost:8080/employees')
    element.all(by.repeater('appt in appointments')).count().then(function(oldCount) {
      startCount = oldCount;
    });

  });


  it('upload appointments', function() {

    var fileToUpload = '/Users/ElsieHwang/RouteScheduler/ScheduleOptimizer/data/SalesAppointments.csv';

    // go to appointment page, should get empty appointment
    browser.get('http://localhost:8080/appointments');
    browser.sleep(2000);

    // go to homepage
    browser.get('http://localhost:8080');

    // click upload button in header
    element(by.id('upload-button')).click();


    // send the file path
    element(by.id('fileN')).sendKeys(fileToUpload);

    // submit the path
    element(by.id('fileupload')).click();

    // // sleep due to bug in protractor with window.location redirecting
    // // https://github.com/angular/protractor/issues/762
    
    // go to appointment page, should get some appointments
    browser.get('http://localhost:8080/appointments');
    browser.sleep(2000);
  });


  it('generate routes', function() {

    // go to homepage
    browser.get('http://localhost:8080');

    // click generate route button in header
    element(by.id('generate')).click();
    browser.sleep(2000);

    // // sleep due to bug in protractor with window.location redirecting
    // // https://github.com/angular/protractor/issues/762
    
    browser.get('http://localhost:8080/results');
    browser.sleep(2000);
  });


  // it('should display an added employee', function() {
  //   // go to homepage
  //   browser.get('http://localhost:8080');

  //   // click upload button in header
  //   element(by.id('employees-button')).click();

  //   // click Add/Delete Employees button
  //   element(by.id('manage-button')).click();

  //   // enter form info
  //   element(by.id('add-name')).sendKeys('John Smith');
  //   element(by.id('address')).sendKeys('1234 Chicago Avenue, Evanston, IL 60201');
  //   element(by.cssContainingText('option', 'GreenBay')).click();
  //   element(by.id('optionsRadios1')).click();

  //   // click add employee
  //   element(by.id('add-employee')).click();
  //   // sleep due to bug in protractor with window.location redirecting
  //   // https://github.com/angular/protractor/issues/762
  //   browser.sleep(3000);

  //   // get new number of employees
  //   expect(element.all(by.repeater('stuff in view')).count()).toEqual(startCount + 1);
  // });

  // it('should not display a deleted employee', function() {
  //   // go to homepage
  //   browser.get('http://localhost:8080');

  //   // click upload button in header
  //   element(by.id('employees-button')).click();

  //   // find the employee we just added
  //   var newEmployee = element.all(by.repeater('stuff in view')).last();

  //   // click delete employee
  //   newEmployee.element(by.id('delete')).click();

  //   // sleep due to bug in protractor with window.location redirecting
  //   // https://github.com/angular/protractor/issues/762
  //   browser.sleep(3000);

  //   // get new number of employees
  //   expect(element.all(by.repeater('stuff in view')).count()).toEqual(startCount - 1);
  // });



});
