import { signOut } from "@/auth";
import { BookList } from "@/components/BookList";
import { Button } from "@/components/ui/button";
import { sampleBooks } from "@/constants";

export default function ProfilePage() {
  return (
    <>
      <form
        action={async () => {
          "use server";

          await signOut();
        }}
        className="mb-10"
      >
        <Button>Log Out</Button>
      </form>
      <BookList title="Borrowed books" books={sampleBooks} />
    </>
  );
}
