import {type ReactElement, useContext, useState} from 'react'
import './App.css'
import {Paper} from "./components/Paper/Paper.js";
import {Tab, Tabs} from "./components/Tabs/Tabs.js";
import {Chat} from "./modules/Chat/Chat.js";
import {Participants} from "./modules/Participants/Participants.js";
import {RTCContext, RTCProvider} from "./RTC/rtc.context.js";
import {useRTCPeerConnection} from "./RTC/rtc.peer.js";

const TabType = {
  Participants: 0,
  Chat: 1
}

function App(): ReactElement {

  return (
    <RTCProvider>
      <section >
       <Main />
      </section>
    </RTCProvider>
  )
}

function Main(): ReactElement {
  const { state, onRTCEvent } = useContext(RTCContext);
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [tab, setTab] = useState<number>(TabType.Participants)
  const {connected, connect, disconnect, chat} = useRTCPeerConnection(onRTCEvent)

  if (!connected) {
    return (
        <div>
          {connected ? (
              <>
                <input value={message} onChange={event => setMessage(event.target.value)}/>
                <button
                    className="counter"
                    onClick={(): void => chat(message)}
                >
                  Send
                </button>
              </>
          ) : (
              <>
                <input value={name} onChange={event => setName(event.target.value)}/>
                <button
                    className="counter"
                    onClick={(): void => connect(name)}
                    disabled={!name}
                >
                  Connect
                </button>
              </>
          )}

          {connected ? (
              <button
                  className="counter"
                  onClick={(): void => disconnect()}
              >
                Disconnect
              </button>
          ): null}
        </div>
    )
  }

   return (
       <Paper title="Status meeting standup" onClose={disconnect} style={{ height: '800px', width: '500px'}} >
         <Tabs>
           <Tab active={tab === TabType.Participants} onClick={(): void => setTab(TabType.Participants)}>
             Participants ({state.participants.length})
           </Tab>
           <Tab active={tab === TabType.Chat} onClick={(): void => setTab(TabType.Chat)}>
             Chat
           </Tab>
         </Tabs>
         {tab === TabType.Participants && (
             <Participants participants={state.participants}/>
         )}
         {tab === TabType.Chat && (
             <Chat messages={state.messages} onSend={chat}/>
         )}
       </Paper>
   )
}

export default App
