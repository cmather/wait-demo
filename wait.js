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

    this.route('delay', {
      path: '/delay',
      before: [
        function () {
          console.log('first before');
        },

        function () { 
          console.log('1');
          this.subscribe('delayed-collection1').wait();
        },

        function () {
          console.log('2');
          this.subscribe('delayed-collection2').wait();
        }
      ]
    });
  });
}
