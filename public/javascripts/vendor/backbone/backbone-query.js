((function(){var a,b,c,d,e,f,g,h,i,j,k,l,m,n,o=Array.prototype.indexOf||function(a){for(var b=0,c=this.length;b<c;b++)if(b in this&&this[b]===a)return b;return-1};h=function(a){var b,c,d,e,f,g,i;i=[];for(b in a){e=a[b],c={key:b};if(_.isRegExp(e))c.type="$regex",c.value=e;else if(_(e).isObject()&&!_(e).isArray())for(f in e){g=e[f];if(n(f,g)){c.type=f;switch(f){case"$elemMatch":case"$relationMatch":c.value=h(g);break;case"$computed":d={},d[b]=g,c.value=h(d);break;default:c.value=g}}}else c.type="$equal",c.value=e;c.type==="$equal"&&_(c.value).isObject()&&(c.type="$oEqual"),i.push(c)}return i},n=function(a,b){switch(a){case"$in":case"$nin":case"$all":case"$any":return _(b).isArray();case"$size":return _(b).isNumber();case"$regex":return _(b).isRegExp();case"$like":case"$likeI":return _(b).isString();case"$between":return _(b).isArray()&&b.length===2;case"$cb":return _(b).isFunction();default:return!0}},m=function(a,b){switch(a){case"$like":case"$likeI":case"$regex":return _(b).isString();case"$contains":case"$all":case"$any":case"$elemMatch":return _(b).isArray();case"$size":return _(b).isArray()||_(b).isString();case"$in":case"$nin":return b!=null;case"$relationMatch":return b!=null&&b.models;default:return!0}},i=function(b,c,d,e,g){switch(b){case"$equal":return _(d).isArray()?o.call(d,c)>=0:d===c;case"$oEqual":return _(d).isEqual(c);case"$contains":return o.call(d,c)>=0;case"$ne":return d!==c;case"$lt":return d<c;case"$gt":return d>c;case"$lte":return d<=c;case"$gte":return d>=c;case"$between":return c[0]<d&&d<c[1];case"$in":return o.call(c,d)>=0;case"$nin":return o.call(c,d)<0;case"$all":return _(c).all(function(a){return o.call(d,a)>=0});case"$any":return _(d).any(function(a){return o.call(c,a)>=0});case"$size":return d.length===c;case"$exists":case"$has":return d!=null===c;case"$like":return d.indexOf(c)!==-1;case"$likeI":return d.toLowerCase().indexOf(c.toLowerCase())!==-1;case"$regex":return c.test(d);case"$cb":return c.call(e,d);case"$elemMatch":return f(d,c,!1,a,"elemMatch");case"$relationMatch":return f(d.models,c,!1,a,"relationMatch");case"$computed":return f([e],c,!1,a,"computed");default:return!1}},f=function(a,b,c,d,e){var f;return e==null&&(e=!1),f=e?b:h(b),d(a,function(a){var b,d,g,h,j;for(h=0,j=f.length;h<j;h++){d=f[h],b=function(){switch(e){case"elemMatch":return a[d.key];case"computed":return a[d.key]();default:return a.get(d.key)}}(),g=m(d.type,b),g&&(g=i(d.type,d.value,b,a,d.key));if(c===g)return c}return!c})},b=function(a,b){var c,d,e,f;f=[];for(d=0,e=a.length;d<e;d++)c=a[d],b(c)&&f.push(c);return f},k=function(a,b){var c,d,e,f;f=[];for(d=0,e=a.length;d<e;d++)c=a[d],b(c)||f.push(c);return f},a=function(a,b){var c,d,e;for(d=0,e=a.length;d<e;d++){c=a[d];if(b(c))return!0}return!1},j={$and:function(a,c){return f(a,c,!1,b)},$or:function(a,c){return f(a,c,!0,b)},$nor:function(a,b){return f(a,b,!0,k)},$not:function(a,b){return f(a,b,!1,k)}},c=function(a,b,c){var d,f,g,h;return g=JSON.stringify(b),d=(h=a._query_cache)!=null?h:a._query_cache={},f=d[g],f||(f=e(a,b,c),d[g]=f),f},d=function(a,b){var c,d,e;return c=_.intersection(["$and","$not","$or","$nor"],_(b).keys()),d=a.models,c.length===0?j.$and(d,b):(e=function(a,c){return j[c](a,b[c])},_.reduce(c,e,d))},e=function(a,b,c){var e;return e=d(a,b),c.sortBy&&(e=l(e,c)),e},l=function(a,b){return _(b.sortBy).isString()?a=_(a).sortBy(function(a){return a.get(b.sortBy)}):_(b.sortBy).isFunction()&&(a=_(a).sortBy(b.sortBy)),b.order==="desc"&&(a=a.reverse()),a},g=function(a,b){var c,d,e,f;return b.offset?e=b.offset:b.page?e=(b.page-1)*b.limit:e=0,c=e+b.limit,d=a.slice(e,c),b.pager&&_.isFunction(b.pager)&&(f=Math.ceil(a.length/b.limit),b.pager(f,d)),d};if(typeof require!="undefined"){if(typeof _=="undefined"||_===null)_=require("underscore");if(typeof Backbone=="undefined"||Backbone===null)Backbone=require("backbone")}Backbone.QueryCollection=Backbone.Collection.extend({query:function(a,b){var d;return b==null&&(b={}),b.cache?d=c(this,a,b):d=e(this,a,b),b.limit&&(d=g(d,b)),d},where:function(a,b){return b==null&&(b={}),new this.constructor(this.query(a,b))},reset_query_cache:function(){return this._query_cache={}}}),typeof exports!="undefined"&&(exports.QueryCollection=Backbone.QueryCollection)})).call(this)
