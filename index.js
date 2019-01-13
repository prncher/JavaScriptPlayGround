const base = (function () {
    function base() {
        this.function1 = function (message) {
            console.log('This message : ' + message + ' -is passed to an inline function')
        }

        base.prototype.function2 = function (message) {
            console.log('This message : ' + message + ' -is passed to a prototype function')
        }

        base.function3 = function (message) {
            console.log('This message : ' + message + ' - is passed to a static function')
        }
    }
    return base;
})();

const derived = (function () {
    function derived() {
        base.call(this);
        this.prototype = Object.create(base.prototype);
    }

    return derived;
})();

const derivedUsingPrototype = (function () {
    function derivedUsingPrototype() {
        base.call(this);
    }

    derivedUsingPrototype.prototype = Object.create(base.prototype);
    return derivedUsingPrototype;
})();

function fnCaller(fn, arg) {
    try {
        fn.call(this, arg);
    }
    catch (error) {
        console.log(error);
    }
}

function liberalFn() {
    var obj = {};
    Object.defineProperty(obj, 'x', { value: 5, writable: false });
    obj.x = 6;

    Object.preventExtensions(obj);
    obj.y = 6;
}

function strictFn() {
    'use strict';

    var obj = {};
    Object.defineProperty(obj, 'x', { value: 5, writable: false });
    try {
        obj.x = 6;
    } catch (error) {
        console.log(error);
    }

    Object.preventExtensions(obj);
    try {
        obj.y = 6;
    } catch (error) {
        console.log(error);
    }
}

(function () {
    // Show multiple ways to call functions.
    const instance1 = new derived();
    fnCaller(instance1.function1, 'Testing 1');
    fnCaller(instance1.function2, 'Testing 2');
    fnCaller(instance1.prototype.function2, 'Testing 3');
    fnCaller(instance1.function3, 'Testing 4');
    if (derived.function3 !== undefined) {
        derived.function3('Testing 5');
    }

    const instance2 = new derivedUsingPrototype();
    fnCaller(instance2.function1, 'Testing 6');
    fnCaller(instance2.function2, 'Testing 7');
    fnCaller(instance2.function3, 'Testing 8');
    if (derivedUsingPrototype.function3 !== undefined) {
        derivedUsingPrototype.function3('Testing 9');
    }

    fnCaller(base.function3, 'Testing 10');
    fnCaller(base.prototype.function2, 'Testing 11');

    // Show strict and non-strict cases
    const liberal = new liberalFn();
    const strict = new strictFn();
})();