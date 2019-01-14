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
    obj = { get n() { return 1; } };
    Object.defineProperty(obj, 'x', { value: 5, writable: false });
    obj.x = 6;
    obj.n = 2;

    Object.preventExtensions(obj);
    obj.y = 6;
    delete Object.prototype;

    // setting properties on primitive values.
    false.true = '';
    (14).sailing = 'home';
    'with'.you = 'far away';
    eval('var y;delete y');
}

function executeExpression(x) {
    'use strict';
    try {
        eval(x)
    } catch (error) {
        console.log(error);
    }
}

function strictFn() {
    'use strict';

    var obj = { get n() { return 1; } };
    Object.defineProperty(obj, 'x', { value: 5, writable: false });
    try {
        // Assign to read-only property.
        obj.x = 6;
    } catch (error) {
        console.log(error);
    }

    try {
        // Assign to getter property.
        obj.n = 2;
    } catch (error) {
        console.log(error);
    }


    Object.preventExtensions(obj);
    try {
        // Create a new property on non extensible object.
        obj.y = 6;
    } catch (error) {
        console.log(error);
    }

    // No error - See https://bugzilla.mozilla.org/show_bug.cgi?id=1041128
    obj = { a: 1, a: 2 };

    try {
        delete Object.prototype;
    } catch (error) {
        console.log(error);
    }

    // setting properties on primitive values.
    executeExpression("false.true = ''");
    executeExpression("(14).sailing = 'home'");
    executeExpression("'with'.you = 'far away'");

    // delete arbitrary variable
    executeExpression('var y; delete y;');
}

function functionCalls() {
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
}

function applyStrict() {
    // Show strict and non-strict cases
    const liberal = new liberalFn();
    const strict = new strictFn();
}

function fatArrow(){
    this.y = ' Test 1';
    var arrowFn = x => x + this.y;

    // Uses the first value of y = ' Test 1' always.
    console.log(arrowFn('Fat Arrow - this '));
    console.log(arrowFn.call({ y: ' Test3' }, 'Fat Arrow - this '));
    console.log(arrowFn.apply({ y: ' Test3' }, ['Fat Arrow - this ']));

    this.y = ' Test 2';
    console.log(arrowFn('Fat Arrow - this '));
    console.log(arrowFn.call({ y: ' Test4' }, 'Fat Arrow - this '));
    console.log(arrowFn.apply({ y: ' Test4' }, ['Fat Arrow - this ']));
}

(function () {
    functionCalls();
    applyStrict();
    fatArrow();
})();