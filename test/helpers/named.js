'use strict';

var Assert = require('assert');
var Handlebars = require('handlebars');
var Linter = require('../../index').linter;

describe('Linting helper named parameters', function () {
	it('empty html should not generate any errors', function () {
		var html = '';
		var config = {
			helpers: {
				helper1: {
					params: {
						template: {
							formats: ['string', 'variable'],
							required: true
						}
					}
				}
			}
		};
		var ast = Handlebars.parse(html);
		var actual = Linter(config, ast);
		var expected = [];
		Assert.deepEqual(actual, expected);
	});
	it('correct helper should not generate any errors', function () {
		var html = "{{helper1 template=foobar}}";
		var config = {
			helpers: {
				helper1: {
					params: {
						template: {
							formats: ['string', 'variable'],
							required: true
						}
					}
				}
			}
		};
		var ast = Handlebars.parse(html);
		var actual = Linter(config, ast);
		var expected = [];
		Assert.deepEqual(actual, expected);
	});
	it('missing required helper named parameter should generate error', function () {
		var html = "{{helper1}}";
		var config = {
			helpers: {
				helper1: {
					params: {
						template: {
							required: true
						}
					}
				}
			}
		};
		var ast = Handlebars.parse(html);
		var actual = Linter(config, ast);
		Assert.notEqual(actual.length, 0);
	});
	it('missing optional helper named parameter should NOT generate error', function () {
		var html = "{{helper1}}";
		var config = {
			helpers: {
				helper1: {
					params: {
						template: {
							required: false
						}
					}
				}
			}
		};
		var ast = Handlebars.parse(html);
		var actual = Linter(config, ast);
		Assert.equal(actual.length, 0);
	});
	it('missing second optional helper named parameter should NOT generate error', function () {
		var html = "{{helper1 param1='foo'}}";
		var config = {
			helpers: {
				helper1: {
					params: {
						param1: {
							formats: ['string', 'variable'],
							required: true
						},
						param2: {
							formats: ['string', 'variable'],
							required: false
						}
					}
				}
			}
		};
		var ast = Handlebars.parse(html);
		var actual = Linter(config, ast);
		Assert.equal(actual.length, 0);
	});
	it('helper named parameter with wrong value format should generate error', function () {
		var html = "{{helper1 param1=42}}";
		var config = {
			helpers: {
				helper1: {
					params: {
						param1: {
							formats: ['string'],
							required: true
						}
					}
				}
			}
		};
		var ast = Handlebars.parse(html);
		var actual = Linter(config, ast);
		Assert.equal(actual.length, 1);
	});
	it('block helper named parameter with wrong value format should generate error', function () {
		var html = "{{#helper1 param1=42}}{{/helper1}}";
		var config = {
			helpers: {
				helper1: {
					params: {
						param1: {
							formats: ['string'],
							required: true
						}
					}
				}
			}
		};
		var ast = Handlebars.parse(html);
		var actual = Linter(config, ast);
		Assert.equal(actual.length, 1);
	});
	it('extra helper named parameter should generate warning');
});
