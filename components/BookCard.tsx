import Link from "next/link";
import { BookCover } from "./BookCover";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "./ui/button";

export function BookCard({
  id,
  title,
  genre,
  coverColor,
  coverUrl,
  isLoanedBook = false,
}: Book) {
  return (
    <li className={cn({ "xs:w-52 w-full": isLoanedBook })}>
      <Link
        href={`/books/${id}`}
        className={cn({ "w-full flex flex-col items-center": isLoanedBook })}
      >
        <BookCover coverColor={coverColor} coverImage={coverUrl} />
        <div className={cn("mt-4", { "xs:w-40 max-w-28": !isLoanedBook })}>
          <p className="book-title">{title}</p>
          <p className="book-genre">{genre}</p>
        </div>
        {isLoanedBook && (
          <div className="mt-3 w-full">
            <div className="book-loaned">
              <Image
                src={"icons/calendar.svg"}
                alt="calendar"
                width={18}
                height={18}
                className="object-contain"
              />
              <p className="text-light-100">11 days left to return</p>
            </div>
            <Button className="book-btn">Download Reciept</Button>
          </div>
        )}
      </Link>
    </li>
  );
}
