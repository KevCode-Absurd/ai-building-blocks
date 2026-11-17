import os, subprocess, shutil, pathlib, sys
env = {k: v for k, v in os.environ.items() if not k.endswith('API_KEY') and k not in ('OPENAI_BASE_URL', 'OPENAI_API_BASE')}
case=pathlib.Path(__file__).resolve().parents[4]/'benchmark-smoke-standalone'
case.mkdir(exist_ok=True)
binary=sys.argv[1] if len(sys.argv)>1 else shutil.which('codex')
command = [binary, 'exec', '--ephemeral', '--skip-git-repo-check', '--sandbox','workspace-write','--disable','plugins', '--json', '-c', 'forced_login_method="chatgpt"','--cd',str(case), '-']
with (case/'trace.jsonl').open('w',encoding='utf-8') as out, (case/'stderr.txt').open('w',encoding='utf-8') as err:
    proc=subprocess.Popen(command,stdin=subprocess.PIPE,stdout=out,stderr=err,text=True,encoding='utf-8',env=env)
    try:proc.communicate('Use the shell tool to calculate 19*23 and write the result to answer.txt in the current working directory. Then read it back and report the observed value. No other files or network.',timeout=120)
    except subprocess.TimeoutExpired:
        subprocess.run(['taskkill','/PID',str(proc.pid),'/T','/F'],capture_output=True)
        proc.communicate()
print((case/'trace.jsonl').read_text(encoding='utf-8'))
print((case/'stderr.txt').read_text(encoding='utf-8')[-3000:])
print('EXIT', proc.returncode)
