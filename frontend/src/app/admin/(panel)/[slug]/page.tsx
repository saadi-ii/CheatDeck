import { EditorLoader } from "@/features/editor/components/editor-loader";

export default async function EditCheatsheetPage(props: PageProps<"/admin/[slug]">) {
  const { slug } = await props.params;
  return <EditorLoader slug={slug} />;
}
