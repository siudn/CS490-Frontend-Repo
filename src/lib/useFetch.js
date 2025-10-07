import { useEffect, useState } from "react";
export default function useFetch(url) {
  const [data,setData]=useState(null);
  useEffect(()=>{ if(!url) return; let ok=true;
    fetch(url).then(r=>r.json()).then(d=>ok&&setData(d)).catch(()=>{});
    return ()=>{ok=false};
  },[url]);
  return data;
}
