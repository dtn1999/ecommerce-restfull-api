import DELETE from './utils/DELETE';
import UPDATE from './utils/UPDATE';
import GET from './utils/GET';
import POST from './utils/POST';

export default {
  ...GET,
  ...UPDATE,
  ...POST,
  ...DELETE,
};
