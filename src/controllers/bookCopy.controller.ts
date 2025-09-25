import { Body, Controller, Get, Post, Patch, Route, Tags, Path, Delete, Security } from "tsoa";
import { CustomError } from "../middlewares/errorHandler";
import { BookCopyDTO } from "../dto/bookCopy.dto";
import { bookCopyService } from "../services/bookCopy.service";
import { BookCopy } from "../models/bookCopy.model";

@Route("book-copies")
@Tags("BookCopys")
export class BookCopyController extends Controller {
  @Get("/")
  @Security("jwt", ["bookcopy:read"])
  public async getAllBookCopies(): Promise<BookCopyDTO[]> {
    return bookCopyService.getAllBookCopies();
  }

  @Get("{id}")
  @Security("jwt", ["bookcopy:read"])
  public async getBookCopyById(id: number): Promise<BookCopyDTO> {
    let bookCopy: BookCopy | null = await bookCopyService.getBookCopyById(id);

    if (bookCopy === null) {
      let error: CustomError = new Error(`Book Copy ${id} not found`);
      error.status = 404;
      throw error;
    }

    return bookCopy;
  }

  @Post("/")
  @Security("jwt", ["bookcopy:create"])
  public async createBookCopy(
    @Body() requestBody: BookCopyDTO
  ): Promise<BookCopyDTO> {
    let { available, bookId, state } = requestBody;

    if (bookId === undefined) {
      let error: CustomError = new Error(
        "Book ID is required to create a book copy"
      );
      error.status = 400;
      throw error;
    }
    return bookCopyService.createBookCopy(bookId, available, state);
  }

  @Patch("{id}")
  @Security("jwt", ["bookcopy:update"])
  public async updateBookCopy(
    @Path() id: number,
    @Body() requestBody: BookCopyDTO
  ): Promise<BookCopyDTO> {
    let { available, bookId, state } = requestBody;

    return bookCopyService.updateBookCopy(id, bookId, available, state);
  }

  @Delete("{id}")
  @Security("jwt", ["bookcopy:delete"])
  public async deleteBookCopy(@Path() id: number): Promise<void> {
    await bookCopyService.deleteBookCopy(id);
  }
}