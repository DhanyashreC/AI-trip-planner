"use client"
import { Textarea } from '@/components/ui/textarea'
import React from 'react'




import { ArrowBigDown, Globe2, Landmark, Plane, Send } from "lucide-react";
import { Button } from '@/components/ui/button';
import { HeroVideoDialog } from '@/components/ui/hero-video-dialog';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/router';


const suggestions= [
  {
    title:'Create New trip',
    icon: <Globe2  className= 'text-blue-400 h-5 w-5'/> 
  },
  {
  title:'Inspire me where to go',
  icon:<Plane className='text-green-500 h-5'/>
},
{
  title:'Discover Hidden games',
  icon:<Landmark className='text-yellow-600 h-5 w-5'/>
},
{
  title:'Adventure Destination',
  icon:<Globe2 className='text-orange-500 h-5 w-5'/>
}
     
        
      
    
  
]

function Hero() {
   const { user }=useUser();
   const router=useRouter
   const onSend=()=>{
    if(!user)
    {
       router.push('/sign-in')


      return ;
    }

   }
  return (
    <div className='mt-24 flex items-center justify-center'>
      {/* Content */}
      <div className='max-w-3xl w-full text-center space-y-6 '>
        <h2 className="text-xl md:text-5xl font-bold">
          Hey, I'm your personal{" "}
          <span className="text-primary">
            Trip Planner
          </span>
        </h2>

        <p className='text-lg'>
          Tell me what you want and I'll handle the rest:
          Flights, Hotels, Trip Planner — all in seconds.
        </p>

        {/* Input */}
        <div className="border rounded-2xl p-4 relative">
          <Textarea
            placeholder="Create a trip for Paris from New York"
            className="h-20 border-0 focus-visible:ring-0 shadow-none resize-none"
          />

          <Button
            size="icon"
            className="absolute bottom-4 right-6 "onClick={()=>onSend()}>
          
            <Send className="h-4 w-4" />
          </Button>
        </div>

        {/* Suggestion list */}
<div className='flex gap-5'>
  {suggestions.map((suggestions,index)=>(
    <div key={index} className='flex items-center gap-2 border rounded-full p-2 cursor-pointer
    hover:bg-primary'>
      {suggestions.icon}
      <h2 className='text-sm'>{suggestions.title}</h2>
      </div>
  ))}
</div>
<div className='flex items-center justify-center flex-col'>
<h2 className='my-7 mt-14 flex gap-2 text-center'> Not sure where to start? <strong> See how it works</strong >< ArrowBigDown/></h2>
        {/* Video section */}
        <HeroVideoDialog
  className="block dark:hidden"
  animationStyle="from-center"
  videoSrc="https://www.example.com/dummy-video"
  thumbnailSrc="https://mma.prnewswire.com/media/2401528/1_MindtripProduct.jpg?p=facebook"
  thumbnailAlt="Dummy Video Thumbnail"
/>
</div>

      </div>
    </div>
  )
}

export default Hero