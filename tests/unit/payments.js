import Vue from 'vue';
import Payments from '../../src/views/Payments.vue';
import assert from 'assert';

describe('Payments', () => {
  // const vm = new Vue(Payments).$mount()
  // const Constructor = Vue.extend(Payments)
  // const vm = new Constructor({
  //   accountId: 0,
  //   amount: null,
  //   // Models
  //   client: '',
  //   reference: '',
  //   invoiceInput: '',
  //   invoices: [ '123', '111111', '123456', '33345q', '1234567', 'r42ft43', '421 42' ],
  //   extracted: [],
  //   comments: '',
  // }).$mount()

  class PaymentsTest {
    invoices = ['123456', '111111', '222222,333333 444444;555555/666666:150,777777'];

    processInvoices = Payments.methods.cleanInvoices;
    parseInvoiceString = Payments.methods.parseInvoiceString;
    cleanInvoices = Payments.methods.cleanInvoices;
    $nextTick = Vue.nextTick;
  }


  it('methods.processInvoices', () => {
    const paymentsTest = new PaymentsTest();
    paymentsTest.cleanInvoices();

    assert.equal(JSON.stringify(paymentsTest.invoices), JSON.stringify(['123456', '111111', '222222', '333333', '444444', '555555', '666666:150', '777777']));
  });

  it('methods.parseInvoiceString', () => {
    const paymentsTest = new PaymentsTest();

    assert.equal(
      JSON.stringify(paymentsTest.parseInvoiceString('100001; 100002,100003; 100004, 100005')),
      JSON.stringify(['100001', '100002', '100003', '100004', '100005']),
    );
    assert.equal(
      JSON.stringify(paymentsTest.parseInvoiceString('1001')),
      JSON.stringify([]),
    );
    assert.equal(
      JSON.stringify(paymentsTest.parseInvoiceString('100001')),
      JSON.stringify(['100001']),
    );
    assert.equal(
      JSON.stringify(paymentsTest.parseInvoiceString('d00fd1')),
      JSON.stringify([]),
    );
    assert.equal(
      JSON.stringify(paymentsTest.parseInvoiceString('100002;')),
      JSON.stringify(['100002']),
    );
    assert.equal(
      JSON.stringify(paymentsTest.parseInvoiceString('100003;        100001,100002;100004')),
      JSON.stringify(['100003', '100001', '100002', '100004']),
    );
  });


  it('methods.cleanInvoices', () => {
    const paymentsTest = new PaymentsTest();

    paymentsTest.invoices = ['100004;'];
    paymentsTest.cleanInvoices();

    assert.equal(
      JSON.stringify(paymentsTest.invoices),
      JSON.stringify(['100004']),
    );
  });
});