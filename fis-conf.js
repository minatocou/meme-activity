fis.set('new date', Date.now());
fis.set('project.ignore', [
    'node_modules/**',
    '.git/**',
]);


fis.media('dev').match('*',{
    release: false
}).match(/^\/src\/static\/(.+\.html)/i,{
    release: false
}).match(/^\/src\/views\/(.+\.html)/i,{
    release: 'views/$1'
}).match(/^\/src\/static\/(.+\.(?:less))$/i, {
    parser: fis.plugin('less'),
    rExt: '.css',
    release: 'static/$1',
    url: '/$1',
}).match(/^\/src\/static\/(.+\.(?:css|sass|scss))$/i,{
    release: 'static/$1',
    url: '/$1',
}).match(/^\/src\/static\/(.+\.js)/i,{
    release: 'static/$1',
    url: '/$1',
}).match(/^\/src\/(.+\.(?:jpg|png|gif))$/i,{
    release: 'static/img/$1',
    url: '/img/$1',

}).match(/^\/src\/.+?([^/]+\.(?:otf|eot|svg|ttf|woff|woff2))$/i,{
    release: 'static/font/$1',
    url: '/font/$1',
    optimizer:false,
}).match(/^\/src\/.+?([^/]+\.(?:map|json))$/i,{
    release: 'static/other/$1',
    url: '/other/$1',
    optimizer:false,
})





fis.media('prod').match('*',{
    release: false
}).match(/^\/src\/static\/(.+\.html)/i,{
    release: false
}).match(/^\/src\/views\/(.+\.html)/i,{
    release: 'views/$1'
}).match(/^\/src\/static\/(.+\.(?:less))$/i, {
    parser: fis.plugin('less'),
    rExt: '.css',
    release: 'static/$1',
    url: '/$1',
    optimizer: fis.plugin('clean-css')
}).match(/^\/src\/static\/(.+\.(?:css|sass|scss))$/i,{
    release: 'static/$1',
    url: '/$1',
    optimizer: fis.plugin('clean-css')
}).match(/^\/src\/static\/(.+\.js)/i,{
    release: 'static/$1',
    url: '/$1',
    optimizer: fis.plugin('uglify-js')
}).match(/^\/src\/(.+\.(?:jpg|png|gif))$/i,{
    release: 'static/img/$1',
    url: '/img/$1',
    //optimizer: fis.plugin('png-compressor')
}).match('::package', {
    postpackager: fis.plugin('loader', {
        allInOne: {
            js: function (file) {
                return "/static/js/build/"+file.subpathNoExt+".js";
            },
            css: function (file) {
                return "/static/css/build/"+file.subpathNoExt+".css";
            }
        }
    })
}).match(/^\/static\/css\/build\/(.+\.(?:css|))$/i,{
    release: 'static/css/build/$1',
    url: '/css/build/$1',
    query: '?t=' + fis.get('new date'),

}).match(/^\/static\/js\/build\/(.+\.js)/i,{
    release: 'static/js/build/$1',
    url: '/js/build/$1',
    query: '?t=' + fis.get('new date'),

}).match(/^\/src\/.+?([^/]+\.(?:otf|eot|svg|ttf|woff|woff2))$/i,{
    release: 'static/font/$1',
    url: '/font/$1',
    optimizer:false,
}).match(/^\/src\/.+?([^/]+\.(?:map|json))$/i,{
    release: 'static/other/$1',
    url: '/other/$1',
    optimizer:false,
})
