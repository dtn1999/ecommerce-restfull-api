import GET from './utils/GET';
import DELETE from './utils/DELETE';
import UPDATE from './utils/UPDATE';
import POST from './utils/POST';

export default {
  ...GET,
  ...DELETE,
  ...POST,
  ...UPDATE,
};
