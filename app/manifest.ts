import type { MetadataRoute } from 'next';
export default function manifest(): MetadataRoute.Manifest{return {name:'NaijaOrder',short_name:'NaijaOrder',description:'Your orders. Your customers. One simple dashboard.',start_url:'/app/dashboard',display:'standalone',background_color:'#fffaf0',theme_color:'#064e3b',icons:[{src:'/icon.svg',sizes:'any',type:'image/svg+xml'}]}}
