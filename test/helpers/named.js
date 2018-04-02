'use strict';

var Assert = require('assert');
var Linter = require('../../index').linter;

describe('Linting helper named parameters', function () {
	it('empty html should not generate any errors', function () {
		var html = '';
		var config = {
			helpers: {
				helper1: {
					params: {
						param1: {
							selector: 'named()',
							formats: ['string', 'variable'],
							required: true
						}
					}
				}
			}
		};
		var actual = Linter(html, config);
		var expected = [];
		Assert.deepEqual(actual, expected);
	});
	it('correct helper should not generate any errors', function () {
		var html = "{{helper1 param1=foobar}}";
		var config = {
			helpers: {
				helper1: {
					params: {
						param1: {
							selector: 'named()',
							formats: ['string', 'variable'],
							required: true
						}
					}
				}
			}
		};

		var actual = Linter(html, config);
		var expected = [];
		Assert.deepEqual(actual, expected);
	});
	it('missing required helper named parameter should generate error', function () {
		var html = "{{helper1}}";
		var config = {
			helpers: {
				helper1: {
					params: {
						param1: {
							selector: 'named()',
							required: true
						}
					}
				}
			}
		};

		var actual = Linter(html, config);
		Assert.notEqual(actual.length, 0);
	});
	it('missing optional helper named parameter should NOT generate error', function () {
		var html = "{{helper1}}";
		var config = {
			helpers: {
				helper1: {
					params: {
						param1: {
							selector: 'named()',
							required: false
						}
					}
				}
			}
		};

		var actual = Linter(html, config);
		Assert.equal(actual.length, 0);
	});
	it('missing second optional helper named parameter should NOT generate error', function () {
		var html = "{{helper1 param1='foo'}}";
		var config = {
			helpers: {
				helper1: {
					params: {
						param1: {
							selector: 'named()',
							formats: ['string', 'variable'],
							required: true
						},
						param2: {
							selector: 'named()',
							formats: ['string', 'variable'],
							required: false
						}
					}
				}
			}
		};

		var actual = Linter(html, config);
		Assert.equal(actual.length, 0);
	});
	it('2 named parameter should generate error', function () {
		var html = "{{helper1 param1='foo' param2='bar'}}";
		var config = {
			helpers: {
				helper1: {
					params: {
						param1: {
							selector: 'named()',
							formats: true,
							required: true
						},
						param2: {
							selector: 'named()',
							formats: false,
							required: true
						}
					}
				}
			}
		};

		var actual = Linter(html, config);
		Assert.equal(actual.length, 1);
	});
	it('helper named parameter with wrong value format should generate error', function () {
		var html = "{{helper1 param1=42}}";
		var config = {
			helpers: {
				helper1: {
					params: {
						param1: {
							selector: 'named()',
							formats: ['string'],
							required: true
						}
					}
				}
			}
		};

		var actual = Linter(html, config);
		Assert.equal(actual.length, 1);
	});
	it('block helper named parameter with wrong value format should generate error', function () {
		var html = "{{#helper1 param1=42}}{{/helper1}}";
		var config = {
			helpers: {
				helper1: {
					params: {
						param1: {
							selector: 'named()',
							formats: ['string'],
							required: true
						}
					}
				}
			}
		};

		var actual = Linter(html, config);
		Assert.equal(actual.length, 1);
	});
});
