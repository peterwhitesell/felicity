'use strict';

const Code = require('code');
const Felicity = require('../lib');
const Joi = require('joi');
const Lab = require('lab');
const Uuid = require('uuid');

const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;
const expect = Code.expect;

expect(Felicity.skeleton).to.exist();

describe('Felicity Skeleton', () => {

    it('should fail when calling without proper schema', (done) => {

        expect(Felicity.skeleton).to.throw(Error, 'You must pass a valid schema to generate');
        done();
    });

    it('should return an empty object when schema is empty', (done) => {

        const schema = {};
        const felicitySkeleton = new Felicity.skeleton(schema);

        expect(felicitySkeleton).to.be.an.object();
        done();
    });

    describe('String', () => {

        /*it('should return null', (done) => {

            const schema = Joi.string();
            const felicityInstance = new Felicity.skeleton(schema);

            expect(felicityInstance).to.equal(null);
            done();
        });*/

        it('should return an object with string property set to null', (done) => {

            const schema = Joi.object().keys({
                key1: Joi.string().required()
            });
            const felicityInstance = new Felicity.skeleton(schema);

            expect(felicityInstance.key1).to.equal(null);
            expect(felicityInstance.validate).to.be.a.function();
            done();
        });

        it('should return object with regex pattern set to null', (done) => {

            const schema = Joi.object().keys({
                key1: Joi.string().regex(/\b(?:0|[1-9][0-9]*)/).required()
            });
            const felicityInstance = new Felicity.skeleton(schema);

            expect(felicityInstance.key1).to.equal(null);
            expect(felicityInstance.validate).to.be.a.function();
            done();
        });

        it('should return object with guid set to null', (done) => {

            const schema = Joi.object().keys({
                key1: Joi.string().guid().required()
            });
            const felicityInstance = new Felicity.skeleton(schema);

            expect(felicityInstance.key1).to.equal(null);
            expect(felicityInstance.validate).to.be.a.function();
            done();
        });
    });

    describe('Boolean', () => {

        /*it('should return false', (done) => {

            const schema = Joi.boolean();
            const felicityInstance = new Felicity.skeleton(schema);

            expect(felicityInstance).to.equal(false);
            done();
        });*/

        it('should return an object with boolean property set to false', (done) => {

            const schema = Joi.object().keys({
                key1: Joi.boolean().required()
            });
            const felicityInstance = new Felicity.skeleton(schema);

            expect(felicityInstance.key1).to.equal(false);
            expect(felicityInstance.validate).to.be.a.function();
            done();
        });
    });

    describe('Date', () => {

        /*it('should return null', (done) => {

            const schema = Joi.date();
            const felicityInstance = new Felicity.skeleton(schema);

            expect(felicityInstance).to.equal(null);
            done();
        });*/

        it('should return an object with date property set to null', (done) => {

            const schema = Joi.object().keys({
                key1: Joi.date().required()
            });
            const felicityInstance = new Felicity.skeleton(schema);

            expect(felicityInstance.key1).to.equal(null);
            expect(felicityInstance.validate).to.be.a.function();
            done();
        });
    });

    describe('Number', () => {

        it('should return an object with number property set to 0', (done) => {

            const schema = Joi.object().keys({
                key1: Joi.number().required()
            });
            const felicityInstance = new Felicity.skeleton(schema);

            expect(felicityInstance.key1).to.equal(0);
            expect(felicityInstance.validate).to.be.a.function();
            done();
        });
    });

    describe('Conditional', () => {

        it('should default to the "true" driver', (done) => {

            const schema = Joi.object().keys({
                driver       : true,
                myConditional: Joi.when('driver', {
                    is       : true,
                    then     : Joi.string().required(),
                    otherwise: Joi.number().required()
                })
            });
            const felicityInstance = new Felicity.skeleton(schema);

            expect(felicityInstance.myConditional).to.equal(null);
            expect(felicityInstance.validate).to.be.a.function();
            done();
        });
    });

    describe('Array', () => {

        it('should return an object with array property set to []', (done) => {

            const schema = Joi.object().keys({
                key1: Joi.array().required()
            });
            const felicityInstance = new Felicity.skeleton(schema);

            expect(felicityInstance.key1).to.equal([]);
            expect(felicityInstance.validate).to.be.a.function();
            done();
        });
    });

    describe('Object', () => {

        it('should return an object with no keys', (done) => {

            const schema = Joi.object().keys();
            const felicityInstance = new Felicity.skeleton(schema);

            expect(felicityInstance).to.be.an.object();
            expect(felicityInstance.validate).to.be.a.function();
            done();
        });

        it('should return an object with keys', (done) => {

            const schema = Joi.object().keys({
                key1: Joi.object().keys().required()
            });
            const felicityInstance = new Felicity.skeleton(schema);

            expect(felicityInstance.key1).to.equal({});
            expect(felicityInstance.validate).to.be.a.function();
            done();
        });

        it('should return an object with mixed-type keys', (done) => {

            const schema = Joi.object().keys({
                innerObject: Joi.object().keys({
                    innerArray: Joi.array().items(Joi.number()).min(3).max(6).required(),
                    number    : Joi.number()
                }),
                string     : Joi.string().email().required(),
                date       : Joi.date().raw().required(),
                bool       : Joi.boolean().required(),
                conditional: Joi.when('bool', {
                    is       : true,
                    then     : Joi.object().keys().required(),
                    otherwise: Joi.boolean().required()
                })
            });
            const felicityInstance = new Felicity.skeleton(schema);

            expect(felicityInstance.innerObject).to.be.an.object();
            expect(felicityInstance.innerObject.innerArray).to.equal([]);
            expect(felicityInstance.innerObject.number).to.equal(0);
            expect(felicityInstance.string).to.equal(null);
            expect(felicityInstance.date).to.equal(null);
            expect(felicityInstance.bool).to.equal(false);
            expect(felicityInstance.conditional).to.equal({});
            expect(felicityInstance.validate).to.be.a.function();
            done();
        });

        it('should return an object with mixed-type keys for non-compiled schema', (done) => {

            const schema = {
                innerObject: Joi.object().keys({
                    innerArray: Joi.array().items(Joi.number()).min(3).max(6).required(),
                    number    : Joi.number()
                }),
                string     : Joi.string().email().required(),
                date       : Joi.date().raw().required(),
                bool       : Joi.boolean().required(),
                conditional: Joi.when('bool', {
                    is       : true,
                    then     : Joi.object().keys().required(),
                    otherwise: Joi.boolean().required()
                }),
                optional   : Joi.string().optional(),
                otherCond  : Joi.alternatives().when('bool', {
                    is       : true,
                    then     : Joi.string().required(),
                    otherwise: Joi.boolean().required()
                })
            };
            const felicityInstance = new Felicity.skeleton(schema);

            expect(felicityInstance.innerObject).to.be.an.object();
            expect(felicityInstance.innerObject.innerArray).to.equal([]);
            expect(felicityInstance.innerObject.number).to.equal(0);
            expect(felicityInstance.string).to.equal(null);
            expect(felicityInstance.date).to.equal(null);
            expect(felicityInstance.bool).to.equal(false);
            expect(felicityInstance.conditional).to.equal({});
            expect(felicityInstance.optional).to.be.undefined();
            expect(felicityInstance.otherCond).to.equal(null);
            expect(felicityInstance.validate).to.be.a.function();
            done();
        });

        it('should not include keys with "optional" flag', (done) => {

            const schema = Joi.object().keys({
                key1: Joi.string().required(),
                key2: Joi.string(),
                key3: Joi.string().optional()
            });
            const felicityInstance = new Felicity.skeleton(schema);

            expect(felicityInstance.key1).to.equal(null);
            expect(felicityInstance.key2).to.equal(null);
            expect(felicityInstance.key3).to.not.exist();
            expect(felicityInstance.validate).to.be.a.function();
            done();
        });

        it('should utilize default values', (done) => {

            const schema = Joi.object().keys({
                version  : Joi.string().min(5).default('1.0.0'),
                number   : Joi.number().default(10),
                identity : Joi.object().keys({
                    id: Joi.string().default('abcdefg')
                }),
                condition: Joi.alternatives().when('version', {
                    is       : Joi.string(),
                    then     : Joi.string().default('defaultValue'),
                    otherwise: Joi.number()
                })
            });
            const felicityInstance = new Felicity.skeleton(schema);

            expect(felicityInstance.version).to.equal('1.0.0');
            expect(felicityInstance.number).to.equal(10);
            expect(felicityInstance.identity.id).to.equal('abcdefg');
            expect(felicityInstance.condition).to.equal('defaultValue');
            done();
        });

        it('should utilize default values for non-compiled schema', (done) => {

            const schema = {
                version  : Joi.string().min(5).default('1.0.0'),
                number   : Joi.number().default(10),
                identity : Joi.object().keys({
                    id: Joi.string().default('abcdefg')
                }),
                condition: Joi.alternatives().when('version', {
                    is       : Joi.string(),
                    then     : Joi.string().default('defaultValue'),
                    otherwise: Joi.number()
                })
            };
            const felicityInstance = new Felicity.skeleton(schema);

            expect(felicityInstance.version).to.equal('1.0.0');
            expect(felicityInstance.number).to.equal(10);
            expect(felicityInstance.identity.id).to.equal('abcdefg');
            expect(felicityInstance.condition).to.equal('defaultValue');
            done();
        });
    });

    describe('Input', () => {

        it('should include valid input', (done) => {

            const schema = {
                string: Joi.string().guid().required(),
                number: Joi.number().multiple(13).min(26).required(),
                object: Joi.object().keys({
                    id: Joi.string().min(3).default('OKC').required(),
                    code: Joi.number().required()
                }).required()
            };
            const hydratedInput = {
                string: Uuid.v4(),
                number: 39,
                object: {
                    id: 'ATX',
                    code: 200
                }
            };
            const felicityInstance = new Felicity.skeleton(schema, hydratedInput);

            expect(felicityInstance.string).to.equal(hydratedInput.string);
            expect(felicityInstance.number).to.equal(hydratedInput.number);
            expect(felicityInstance.object).to.equal(hydratedInput.object);
            done();
        });

        it('should include valid and strip invalid/unknown input values', (done) => {

            const schema = Joi.object().keys({
                innerObject: Joi.object().keys({
                    innerArray: Joi.array().items(Joi.number()).min(3).max(6).required(),
                    number    : Joi.number().required().default(3),
                    innerString: Joi.string().required()
                }),
                string     : Joi.string().email().required(),
                date       : Joi.date().raw().required(),
                binary     : Joi.binary().required(),
                bool       : Joi.boolean().required(),
                conditional: Joi.when('bool', {
                    is       : true,
                    then     : Joi.object().keys().required(),
                    otherwise: Joi.boolean().required()
                })
            });
            const hydrationData = {
                innerObject: {
                    innerString: false
                },
                string: 'example@email.com',
                date  : 'not a date',
                binary: 74,
                fake  : true,
                bool  : false,
                conditional: true
            };
            const felicityInstance = new Felicity.skeleton(schema, hydrationData);

            expect(felicityInstance.innerObject).to.be.an.object();
            expect(felicityInstance.innerObject.innerArray).to.equal([]);
            expect(felicityInstance.innerObject.innerString).to.equal(null);
            expect(felicityInstance.innerObject.number).to.equal(3);
            expect(felicityInstance.string).to.equal(hydrationData.string);
            expect(felicityInstance.date).to.equal(null);
            expect(felicityInstance.binary).to.equal(null);
            expect(felicityInstance.fake).to.be.undefined();
            expect(felicityInstance.bool).to.equal(hydrationData.bool);
            expect(felicityInstance.conditional).to.equal(hydrationData.conditional);
            expect(felicityInstance.validate).to.be.a.function();
            done();
        });
    });

    describe('Validate', () => {

        it('should return an object when no callback is provided', (done) => {

            const schema = Joi.object().keys({
                key1: Joi.string(),
                key2: Joi.number(),
                key3: Joi.array().min(4)
            });
            const felicityInstance = new Felicity.skeleton(schema);
            const instanceValidity = felicityInstance.validate();

            expect(instanceValidity).to.be.an.object();
            expect(instanceValidity.errors).to.be.an.array();
            expect(instanceValidity.success).to.equal(false);
            done();
        });

        it('should set properties when validation is successful', (done) => {

            const schema = Joi.object().keys({
                key1: Joi.string()
            });
            const felicityInstance = new Felicity.skeleton(schema);

            felicityInstance.key1 = 'A string';

            const instanceValidity = felicityInstance.validate();

            expect(instanceValidity.errors).to.equal(null);
            expect(instanceValidity.success).to.equal(true);
            done();
        });

        it('should accept a callback', (done) => {

            const schema = Joi.object().keys({
                key1: Joi.string()
            });
            const felicityInstance = new Felicity.skeleton(schema);
            const validationCallback = function (err, result) {

                expect(err).to.be.an.array();
                expect(result).to.not.exist();
                done();
            };

            felicityInstance.validate(validationCallback);
        });

        it('should pass (err, success) to callback when validation is successful', (done) => {

            const schema = Joi.object().keys({
                key1: Joi.string()
            });
            const felicityInstance = new Felicity.skeleton(schema);

            felicityInstance.key1 = 'A string.';

            const validationCallback = function (err, result) {

                expect(err).to.equal(null);
                expect(result.success).to.equal(true);
                done();
            };

            felicityInstance.validate(validationCallback);
        });
    });

    describe('Example', () => {

        it('should return an empty instance', (done) => {

            const schema = Joi.object();
            const felicityInstance = new Felicity.skeleton(schema);
            const felicityExample = felicityInstance.example();

            expect(felicityExample).to.be.an.object();
            expect(Object.keys(felicityExample).length).to.equal(0);
            done();
        });

        it('should return an a hydrated valid instance', (done) => {

            const schema = Joi.object().keys({
                key1: Joi.string(),
                key2: Joi.number().integer(),
                key3: Joi.boolean()
            });
            const felicityInstance = new Felicity.skeleton(schema);
            const felicityExample = felicityInstance.example();

            expect(felicityExample.key1).to.be.a.string();
            expect(felicityExample.key2).to.be.a.number();
            expect(felicityExample.key3).to.be.a.boolean();
            done();
        });
    });
});
