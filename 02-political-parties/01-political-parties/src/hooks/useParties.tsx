import type { ChartData } from "chart.js";
import { use, useState, useEffect } from "react";
import {
  WebSocketContext,
  type SocketResponse,
  type SendType,
} from "../context/WebSocketContext";
import type { Party } from "../types";

const PARTY_COLORS = [
  { bg: "rgba(220, 53, 69, 0.2)", border: "rgb(220, 53, 69)" },
  { bg: "rgba(0, 123, 255, 0.2)", border: "rgb(0, 123, 255)" },
  { bg: "rgba(40, 167, 69, 0.2)", border: "rgb(40, 167, 69)" },
  { bg: "rgba(255, 193, 7, 0.2)", border: "rgb(255, 193, 7)" },
  { bg: "rgba(255, 152, 0, 0.2)", border: "rgb(255, 152, 0)" },
  { bg: "rgba(153, 102, 255, 0.2)", border: "rgb(153, 102, 255)" },
  { bg: "rgba(75, 192, 192, 0.2)", border: "rgb(75, 192, 192)" },
  { bg: "rgba(255, 99, 132, 0.2)", border: "rgb(255, 99, 132)" },
];

export const useParties = () => {
  const { status, lastMessage, send } = use(WebSocketContext);
  const [parties, setParties] = useState<Party[]>([]);

  const handleLastMessage = (message: SocketResponse) => {
    const { type, payload } = message;

    switch (type) {
      case "PARTIES_LIST": {
        setParties(payload as Party[]);
        break;
      }
      case "PARTY_UPDATED":
      case "VOTES_UPDATED": {
        const updatedParty = message.payload as Party;
        setParties((prev) => {
          return prev.map((p) => (p.id === updatedParty.id ? updatedParty : p));
        });
        break;
      }
      case "PARTY_ADDED": {
        const newParty = message.payload as Party;
        setParties((prev) => [...prev, newParty]);
        break;
      }
      case "PARTY_DELETED": {
        const deletedParty = message.payload as Party;
        setParties((prev) => prev.filter((p) => p.id !== deletedParty.id));
        break;
      }
      case "ERROR":
        break;

      default:
        throw new Error(`Unknown type ${type}`);
    }
  };

  useEffect(() => {
    if (lastMessage) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      handleLastMessage(lastMessage);
    }
  }, [lastMessage]);

  const updatePartyName = (id: string, newName: string) => {
    send({ type: "UPDATE_PARTY", payload: { id: id, name: newName } });
  };

  const updateVotes = (id: string, value: number) => {
    const type: SendType = value > 0 ? "INCREMENT_VOTES" : "DECREMENT_VOTES";
    send({ type: type, payload: { id: id } });
  };

  const addParty = () => {
    const color = PARTY_COLORS[parties.length % PARTY_COLORS.length];
    send({
      type: "ADD_PARTY",
      payload: {
        color: color.bg,
        borderColor: color.border,
        name: `Nuevo partido ${parties.length + 1}`,
      },
    });

    //   const newParty: Party = {
    //     id: `${parties.length + 1}`,
    //     name: `Nuevo partido ${parties.length + 1}`,
    //     color: color.bg,
    //     borderColor: color.border,
    //     votes: 0,
    //   };

    //   setParties((prev) => [...prev, newParty]);
  };

  const removeParty = (id: string) => {
    send({ type: "DELETE_PARTY", payload: { id: id } });

    // setParties((prev) => prev.filter((p) => p.id !== id));
  };

  const chartData: ChartData<"bar"> = {
    labels: parties.map((p) => p.name),
    datasets: [
      {
        data: parties.map((p) => p.votes),
        backgroundColor: parties.map((c) => c.color),
        borderColor: parties.map((c) => c.borderColor),
        borderWidth: 2,
      },
    ],
  };
  return {
    parties,
    addParty,
    removeParty,
    updatePartyName,
    updateVotes,

    chartData,
    status
  };
};
