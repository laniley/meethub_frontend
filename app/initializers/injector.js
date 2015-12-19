export function initialize( container, application ) {
  application.inject('component', 'store', 'service:store');
  application.inject('component', 'router', 'router:main');
}

export default {
  name: 'injector',
  initialize:initialize
};
