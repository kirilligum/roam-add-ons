// use the script with "{{ [[roam/render]]: ((insert Copy block ref)) }}#kanban/todo" as a parent

function get_block_string(uid) {
  return window.roamAlphaAPI.data.pull(
  	"[:block/string]", '[:block/uid "'+uid+'"]')[":block/string"];
}

function set_block_string(uid, block_string) {
   window.roamAlphaAPI.updateBlock({"block": 
                {"uid": uid,
                 "string": block_string}})
}


function cycle_tags(uid, tags) {
  var block_string = get_block_string(uid);
  for (const [index, tag] of tags.entries()) {
    var re = new RegExp("#kanban/"+tag+"(?=( |$))");
    if(re.test(block_string)) {
      var rep_index = (index+1)%tags.length;
      var new_block_string = block_string.replace(re, "#kanban/"+tags[rep_index]);
      set_block_string(uid, new_block_string);
    }
  }
}
function set_task_status(uid, tags, taskNewStatus) {
  var block_string = get_block_string(uid);
  for (const [index, tag] of tags.entries()) {
    var re = new RegExp("#kanban/"+tag[0]+"(?=( |$))");
    if(re.test(block_string)) {
      var new_block_string = block_string.replace(re, "#kanban/"+taskNewStatus);
      set_block_string(uid, new_block_string);
    }
  }
}


function main ({args}) {
  var uid = args[0]["block-uid"];
  var tags = [["todo","☐"], ["doing","→"], ["done","☑"], ["waiting","⌚"], ["blocked","🚧"], ["noneed","🪦"]];
  return
    <span>
      {tags.map(tag =>
        <span class="cycle-button" onClick={()=>set_task_status(uid, tags,tag[0])}>{tag[1]}</span>)
      }
    </span>
}
