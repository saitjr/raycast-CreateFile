import { Action, ActionPanel, List, showToast, Toast, closeMainWindow } from "@raycast/api";
import { useExec } from "@raycast/utils";
import { useEffect, useState } from "react";
import { getFileList, IFile } from "./file_reader";
import { execCmd } from "./script";
import path from "path";

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

function StoryListItem(props: { item: IFile; index: number; search: string }) {
  console.log(props.search);
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
  const [searchTerm, setSearchTerm] = useState("");

  const searchRootDir = "/Users/tangjiarong/Desktop";

  useEffect(() => {
    async function search() {
      await fetchStories(searchTerm);
    }
    search();
  }, []);

  async function fetchStories(keyword: string) {
    try {
      let items = await getFileList(searchRootDir);
      items = items.filter((i) => i.name.includes(keyword));
      const fullItems = mergeBlankFile(keyword, items);
      setState({ items: fullItems });
    } catch (error) {
      console.log(error);
      setState({
        error: error instanceof Error ? error : new Error("Something went wrong"),
      });
    }
  }

  function mergeBlankFile(input: string, items: IFile[]): IFile[] {
    if (input === undefined || input === null || input.length === 0) return items;
    const hasSame = items.find((f) => `${f.name}` === input);
    if (hasSame !== undefined) {
      return items;
    }
    const blank: IFile = {
      name: input,
      ext: path.extname(input),
      path: path.join(searchRootDir, input),
    };
    return [blank, ...items];
  }

  async function test(value: unknown) {
    await fetchStories(value as string);
  }

  // console.log(state.items); // Prints stories

  return (
    <List isLoading={!state.items && !state.error} onSearchTextChange={test}>
      {state.items?.map((item, index) => (
        <StoryListItem key={item.name} item={item} index={index} search={searchTerm} />
      ))}
    </List>

    // <List isLoading={!state.items && !state.error} onSearchTextChange={test} throttle>
    //   <List.Section>
    //     {state.items?.map((item, index) => (
    //       <StoryListItem key={item.name} item={item} index={index} search={searchTerm} />
    //     ))}
    //   </List.Section>
    // </List>

    // <List
    //   isLoading={loading}
    //   onSearchTextChange={setSearchText}
    //   searchBarPlaceholder="Search your project..."
    //   throttle
    //   enableFiltering={false}
    // >
    //   <List.Section title="Results" subtitle={data?.length + ""}>
    //     {data?.map((searchResult, index) => (
    //       <SearchListItem
    //         key={searchResult.name + index}
    //         searchResult={searchResult}
    //         appPath={appPath}
    //         forced={forced}
    //         filterProject={filterProject}
    //         commandType={command}
    //       />
    //     ))}
    //   </List.Section>
    // </List>
  );
}
