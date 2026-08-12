// 实时时钟
function updateClock() {
  const now = new Date()
  document.getElementById('clock').innerText = now.toLocaleString('zh-CN')
}
updateClock()
setInterval(updateClock, 1000)

// 明暗主题切换
const html = document.documentElement
const themeBtn = document.getElementById('themeBtn')
if(localStorage.getItem('theme') === 'dark') html.classList.add('dark')
themeBtn.onclick = () => {
  html.classList.toggle('dark')
  localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light')
  themeBtn.innerText = html.classList.contains('dark') ? '切换浅色' : '切换暗色'
}
themeBtn.innerText = html.classList.contains('dark') ? '切换浅色' : '切换暗色'

// ========== 对接CF Pages Functions云端API ==========
const API_PATH = '/api/todo'
const todoListEl = document.getElementById('todoList')
const todoInput = document.getElementById('todoInput')

// 从云端读取待办
async function loadTodos() {
  const res = await fetch(API_PATH)
  const todos = await res.json()
  renderTodos(todos)
}

// 渲染列表
function renderTodos(todos) {
  todoListEl.innerHTML = ''
  todos.forEach((item, idx) => {
    const li = document.createElement('li')
    li.className = 'flex justify-between items-center p-3 bg-gray-50 dark:bg-slate-700 rounded-lg'
    li.innerHTML = `
      <span class="${item.done ? 'line-through text-gray-400' : ''} dark:text-white">${item.text}</span>
      <div class="flex gap-2">
        <button data-idx="${idx}" class="toggle px-2 py-1 bg-green-400 rounded text-sm">√</button>
        <button data-idx="${idx}" class="del px-2 py-1 bg-red-400 rounded text-sm">×</button>
      </div>
    `
    todoListEl.appendChild(li)
  })
}

// 添加待办
document.getElementById('addTodo').onclick = async () => {
  const val = todoInput.value.trim()
  if (!val) return
  await fetch(API_PATH, {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({text: val})
  })
  todoInput.value = ''
  loadTodos()
}
todoInput.onkeydown = e => { if (e.key === 'Enter') document.getElementById('addTodo').click() }

// 勾选完成 / 删除
todoListEl.onclick = async e => {
  const idx = Number(e.target.dataset.idx)
  if (e.target.classList.contains('toggle')) {
    await fetch(API_PATH, {
      method: 'PATCH',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({idx})
    })
  }
  if (e.target.classList.contains('del')) {
    await fetch(API_PATH, {
      method: 'DELETE',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({idx})
    })
  }
  loadTodos()
}

// 初始化加载
loadTodos()