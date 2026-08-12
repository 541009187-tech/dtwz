export default {
  async onRequest({ request, env }) {
    const kv = env.TODO_KV
    let todos = JSON.parse(await kv.get('todo_list') || '[]')
    const method = request.method

    // 获取全部待办
    if (method === 'GET') {
      return Response.json(todos)
    }
    // 新增待办
    if (method === 'POST') {
      const { text } = await request.json()
      todos.push({ text, done: false })
      await kv.put('todo_list', JSON.stringify(todos))
      return Response.json({ ok: true })
    }
    // 切换完成状态
    if (method === 'PATCH') {
      const { idx } = await request.json()
      todos[idx].done = !todos[idx].done
      await kv.put('todo_list', JSON.stringify(todos))
      return Response.json({ ok: true })
    }
    // 删除待办
    if (method === 'DELETE') {
      const { idx } = await request.json()
      todos.splice(idx, 1)
      await kv.put('todo_list', JSON.stringify(todos))
      return Response.json({ ok: true })
    }
    return new Response("404 Not Found", { status: 404 })
  }
}