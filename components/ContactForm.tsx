"use client";
import {useState} from "react";

export function ContactForm(){
  const [state,setState]=useState<"ready"|"sending"|"sent"|"error">("ready");
  async function submit(event:React.FormEvent<HTMLFormElement>){
    event.preventDefault();
    if(state==="sending") return;
    const form=event.currentTarget,data=Object.fromEntries(new FormData(form));
    setState("sending");
    try{
      const response=await fetch("/api/contact",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(data)});
      const result=await response.json();
      if(!response.ok||!result.ok) throw new Error("capture_failed");
      form.reset();setState("sent");
    }catch{setState("error");}
  }
  const field="mt-2 w-full border border-rule bg-transparent p-3 outline-none focus:border-blue";
  return <form onSubmit={submit} className="mt-10 border-t-2 border-ink pt-6">
    <h2 className="text-2xl font-bold">Start a conversation</h2>
    <div className="mt-5 grid gap-5 sm:grid-cols-2">
      <label className="text-sm font-medium">Name<input name="name" autoComplete="name" required maxLength={160} className={field}/></label>
      <label className="text-sm font-medium">Email<input name="email" type="email" autoComplete="email" required maxLength={254} className={field}/></label>
    </div>
    <label className="mt-5 block text-sm font-medium">Company<input name="company" autoComplete="organization" maxLength={180} className={field}/></label>
    <label className="mt-5 block text-sm font-medium">Message<textarea name="message" required maxLength={4000} rows={5} className={field}/></label>
    <div hidden aria-hidden="true"><label>Fax<input name="fax" tabIndex={-1} autoComplete="off"/></label></div>
    <button type="submit" disabled={state==="sending"} className="mt-5 bg-ink px-6 py-3 font-bold text-paper disabled:opacity-50">{state==="sending"?"Sending...":"Send message"}</button>
    <p role="status" aria-live="polite" className="mt-4 min-h-6 text-sm">{state==="sent"?"Thank you. Your message has been received.":state==="error"?"Your message could not be sent. Please try again or email nanadoum81@gmail.com.":""}</p>
  </form>;
}
