'use strict';

var Assert = require('assert');
var Linter = require('../../index');

describe('Linting helper positional parameters', function () {
	it('empty html should not generate any errors', function () {
		var html = '';
		var config = {
			helpers: {
				helper1: {
					params: {}
				}
			}
		};

		var actual = Linter.verifySync(html, config);
		var expected = [];
		Assert.deepEqual(actual, expected);
	});
	it('correct helper should not generate any errors', function () {
		var html = "{{helper1 value1}}";
		var config = {
			helpers: {
				helper1: {
					params: {
						param1: {
							selector: 'positional(0)',
							required: true
						}
					}
				}
			}
		};

		var actual = Linter.verifySync(html, config);
		var expected = [];
		Assert.deepEqual(actual, expected);
	});
	it('missing required helper positional parameter should generate error', function () {
		var html = "{{helper1}}";
		var config = {
			helpers: {
				helper1: {
					params: {
						param1: {
							selector: 'positional(0)',
							required: true
						}
					}
				}
			}
		};

		var actual = Linter.verifySync(html, config);
		Assert.equal(actual.length, 1);
	});
	it('missing optional helper positional parameter should NOT generate error', function () {
		var html = "{{helper1}}";
		var config = {
			helpers: {
				helper1: {
					params: {
						param1: {
							selector: 'positional(0)',
							required: false
						}
					}
				}
			}
		};

		var actual = Linter.verifySync(html, config);
		Assert.equal(actual.length, 0);
	});
	it('missing second optional helper positional parameter should NOT generate error', function () {
		var html = "{{helper1 42}}";
		var config = {
			helpers: {
				helper1: {
					params: {
						param1: {
							selector: 'positional(0)',
							required: true
						},
						param2: {
							selector: 'positional(1)',
							required: false
						}
					}
				}
			}
		};

		var actual = Linter.verifySync(html, config);
		Assert.equal(actual.length, 0);
	});
	it('helper positional parameter with wrong value format should generate error', function () {
		var html = "{{helper1 42}}";
		var config = {
			helpers: {
				helper1: {
					params: {
						param1: {
							selector: 'positional(0)',
							formats: ['string'],
							required: true
						}
					}
				}
			}
		};

		var actual = Linter.verifySync(html, config);
		Assert.equal(actual.length, 1);
	});
	it('block helper positional parameter with wrong value format should generate error', function () {
		var html = "{{#helper1 42}}{{/helper1}}";
		var config = {
			helpers: {
				helper1: {
					params: {
						param1: {
							selector: 'positional(0)',
							formats: ['string'],
							required: true
						}
					}
				}
			}
		};

		var actual = Linter.verifySync(html, config);
		Assert.equal(actual.length, 1);
	});
});
