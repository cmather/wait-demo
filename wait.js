DelayedCollections = {
  one: new Meteor.Collection('delayed-collection1'),
  two: new Meteor.Collection('delayed-collection2')
};

if (Meteor.isServer) {
  Future = Npm.require('fibers/future');

  Meteor.publish('delayed-collection1', function () {
    future = new Future;

    Meteor.setTimeout(function () {
      future.return(DelayedCollections.one.find());
    }, 2000);

    return future.wait();
  });

  Meteor.publish('delayed-collection2', function () {
    future = new Future;

    Meteor.setTimeout(function () {
      future.return(DelayedCollections.two.find());
    }, 2000);

    return future.wait();
  });
}

if (Meteor.isClient) {
  Router.map(function () {
    this.route('home', {
      path: '/'  
    });

    // whether subscribe is in a waitOn or in a before hook the functions
    // will run the first time, then once for each invalidation.
    this.route('delay', {
      path: '/delay',

      waitOn: function () {
        return [
          Meteor.subscribe('delayed-collection1'),
          Meteor.subscribe('delayed-collection2')
        ];
      },

      // before, action, after will run 3 times
      before: [
        function () {
          console.log('first before');
        },

        function () { 
          console.log('1');
        }
      ]
    });
  });
}
