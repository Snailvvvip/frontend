
import path from 'path';
import ts from 'rollup-plugin-typescript2'
// import {nodeResolve} from '@rollup/plugin-node-resolve';
import serve from 'rollup-plugin-serve';

export default {
    input:'./src/index.ts',
    output:{
        file: path.resolve(__dirname, 'dist/bundle.js'), 
        format:'iife', // 自执行函数
        sourcemap: true // tsconfig.json文件中也是放开此选项
    },
    plugins:[
        ts({
            tsconfig: path.resolve(__dirname, 'tsconfig.json')
        }), // 打包的时候用rollup-plugin-typescript插件去打包，使用tsconfig.json配置文件
        serve({
            open:true, // 自动打开
            openPage:'/public/index.html',
            port:3000,
            contentBase:'' // 这个选项必须写，内容为空，不然找不到文件。插件的bug
        }),
        // nodeResolve({
        //     extensions:['.js','.ts']
        // }),
    ] 
}