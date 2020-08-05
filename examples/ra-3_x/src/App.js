import * as React from 'react';
import { Admin, Resource, ListGuesser, Layout } from 'react-admin';
import jsonServerProvider from 'ra-data-json-server';
import TreeMenu from '@bb-tech/ra-treemenu';
import GroupIcon from '@material-ui/icons/Group';

const dataProvider = jsonServerProvider('https://jsonplaceholder.typicode.com');
const App = () => (
  <Admin layout={(props) => <Layout {...props} menu={TreeMenu} />} dataProvider={dataProvider}>
    <Resource name="users" options={{ "label": "Users", "isMenuParent": true }} icon={GroupIcon} />
    <Resource name="posts" options={{ "label": "Posts", "menuParent": "users" }} list={ListGuesser} />
    <Resource name="groups" options={{ "label": "Groups", "isMenuParent": true }} />
    <Resource name="comments" options={{ "label": "Comments", "menuParent": "groups" }} list={ListGuesser} />
  </Admin>
);

export default App;