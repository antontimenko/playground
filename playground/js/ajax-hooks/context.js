import React from 'react';

import AjaxHooksClient from './client';

const defaultAjaxHooksClient = new AjaxHooksClient();

const AjaxHooksContext = React.createContext(defaultAjaxHooksClient);

export default AjaxHooksContext;
