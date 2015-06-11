describe('Route Optimizer', function() {

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

    var appt = element.all(by.repeater('appt in appointments')).count()
    expect(appt).toEqual(27);
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

    var appt = element.all(by.repeater('appt in e.appointmentList')).count();

    expect(appt).toEqual(9);
    
  });

});
