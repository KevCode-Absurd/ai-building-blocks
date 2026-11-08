// A delivery output may be one file or a container of many actual artifacts.
// Hashes here bind submitted records. A host file verifier must inspect bytes.
const hash=value=>/^[a-f0-9]{64}$/.test(value??'');
const pathSafe=value=>typeof value==='string'&&value.length>0&&value.length<=240&&!/^(?:[a-z]+:|[/\\])|[\\\u0000-\u001f?#%]/i.test(value)&&value.split('/').every(part=>part&&part!=='.'&&part!=='..'&&!/[. ]$/.test(part)&&!/[<>:"|*]/.test(part));
const imagePath=value=>/\.(?:png|jpe?g|webp|avif|gif)$/i.test(value??'');

/** output_id + container_sha256 identify the declared container output; path and
 * sha256 then identify a child file. Every child keeps its own slot_id. The plan
 * declares count for a container, so one ZIP record cannot stand in for 25 files.
 */
export function validateArtifactManifest(artifacts,{outputs=[],specs=[]}={}){
  const errors=[],add=(path,message)=>errors.push({path,message}), seen=new Set(),paths=new Set(),coverage=new Map();
  if(!Array.isArray(artifacts)||!artifacts.length)return {ok:false,errors:[{path:'production_artifacts',message:'List the actual produced artifacts.'}],coverage:{}};
  if(artifacts.length>1000)add('production_artifacts','Keep the manifest at or below 1000 child artifacts.');
  artifacts.forEach((artifact,index)=>{
    const at=`production_artifacts[${index}]`,id=artifact?.slot_id,parentId=artifact?.output_id??id;
    if(typeof id!=='string'||!id.trim()||seen.has(id))add(`${at}.slot_id`,'Every actual artifact needs a unique slot ID.');seen.add(id);
    if(!pathSafe(artifact?.path)||paths.has(artifact.path))add(`${at}.path`,'Every artifact needs its own safe relative file path.');paths.add(artifact?.path);
    if(!hash(artifact?.sha256))add(`${at}.sha256`,'Record the actual child file SHA-256.');
    const output=outputs.find(output=>output.id===parentId),spec=specs.find(output=>output.id===parentId);
    if(!output||!spec){add(`${at}.output_id`,'Name an actual completed and declared output.');return;}
    coverage.set(parentId,(coverage.get(parentId)??0)+1);
    if(artifact.output_id!==undefined){
      if(!hash(output.sha256)||artifact.container_sha256!==output.sha256)add(`${at}.container_sha256`,'The container SHA-256 must match the completed output revision, separately from the child file hash.');
      if(!Number.isSafeInteger(spec.count)||spec.count<1)add(`${at}.output_id`,'Declare the actual artifact count in this parent output specification before using a child manifest.');
      if(artifact.path===output.path)add(`${at}.path`,'A child file must be distinct from its container output.');
    }else if(output.path!==artifact.path||output.sha256!==artifact.sha256||!hash(output.sha256)||artifact.container_sha256!==undefined)add(at,'A direct artifact must match its completed output ID, path and current SHA-256.');
    if(artifact.modality==='image'&&!imagePath(artifact.path))add(`${at}.path`,'An image artifact must identify an actual raster image file. A ZIP, document or source bundle is not an image.');
  });
  for(const spec of specs)if(Number.isSafeInteger(spec.count)&&coverage.get(spec.id)!==spec.count)add('production_artifacts',`Output ${spec.id} declares ${spec.count} actual artifacts; its manifest must cover every one exactly once.`);
  return {ok:errors.length===0,errors,coverage:Object.fromEntries(coverage),assurance:'HOST_REPORTED_NOT_BYTE_VERIFIED'};
}
