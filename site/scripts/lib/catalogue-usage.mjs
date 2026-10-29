/** A small catalogue usage guide from the steps already visible at #use. The source remains a CreativeWork. */
export function catalogueUsageHowTo({name,pageUrl,steps}){
  if(typeof name!=='string'||!name.trim()||!/^https:\/\/useaiblocks\.com\/(?:skills|prompts|agents)\/[a-z0-9-]+$/.test(pageUrl??'')||!Array.isArray(steps)||!steps.length||steps.length>10)return null;
  if(steps.some(step=>typeof step!=='string'||!step.trim()||step.length>600))return null;
  return {
    '@type':'HowTo',name:`How to use ${name.trim()}`,url:pageUrl+'#use',
    description:'The catalogue usage steps shown on this page. Read the complete source instructions before doing the task.',
    publisher:{'@id':'https://useaiblocks.com/#org'},
    step:steps.map((step,index)=>({'@type':'HowToStep',position:index+1,text:step.trim().replace(/\s+/g,' '),url:pageUrl+'#use'})),
  };
}
