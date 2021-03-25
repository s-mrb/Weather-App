const path = require('path');

global.api_key_ow = YOURFFKEY;
global.api_key_mb =YOURFFKEY;

const get_static_dir_path = function(){ return path.join(__dirname,'../../client')}

const get_views_path = function(){ return path.join(__dirname,'../../client/views')}

const get_partials_path = function(){ return path.join(__dirname,'../../client/partials')}

exports.get_static_dir_path = get_static_dir_path
exports.get_views_path = get_views_path
exports.get_partials_path = get_partials_path