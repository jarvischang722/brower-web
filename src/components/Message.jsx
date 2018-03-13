import { message } from 'antd'

message.config({
  top: 3,
})

function clear() {
  message.destroy()
}

function run(target) {
  return (content, duration) => {
    clear()
    target(content, duration || 3)
  }
}


const Message = {
  success: run(message.success),
  error: run(message.error),
  info: run(message.info),
  loading: run(message.loading),
  clear,
}

export default Message
