import { Action, ActionPanel, List, showToast, Toast, closeMainWindow } from "@raycast/api";
import { useEffect, useState } from "react";
import { getFileList, IFile } from "./file_reader";
import { execCmd } from "./script";

interface State {
  items?: IFile[];
  error?: Error;
}

function OpenFileAction(props: { item: IFile }) {
  return (
    <Action
      title="Open"
      onAction={async () => {
        try {
          closeMainWindow();
          await execCmd(`code -n ${props.item.path}`);
        } catch (error) {
          await showToast({
            style: Toast.Style.Failure,
            title: "Failed opening item",
            message: error instanceof Error ? error.message : undefined,
          });
        }
      }}
    />
  );
}

function StoryListItem(props: { item: IFile; index: number }) {
  return (
    <List.Item
      title={props.item.name ?? "No title"}
      subtitle={props.item.path}
      actions={
        <ActionPanel>
          <OpenFileAction item={props.item} />
        </ActionPanel>
      }
    />
  );
}

export default function Command() {
  const [state, setState] = useState<State>({});

  useEffect(() => {
    async function fetchStories() {
      try {
        const items = await getFileList("/Users/tangjiarong/Desktop");
        setState({ items: items });
      } catch (error) {
        setState({
          error: error instanceof Error ? error : new Error("Something went wrong"),
        });
      }
    }

    fetchStories();
  }, []);

  console.log(state.items); // Prints stories

  return (
    <List isLoading={!state.items && !state.error}>
      {state.items?.map((item, index) => (
        <StoryListItem key={item.name} item={item} index={index} />
      ))}
    </List>
  );
}
