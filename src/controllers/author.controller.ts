import { Controller, Get, Post, Delete, Route, Path, Body, Tags, Patch, Security } from "tsoa";
import { authorService } from "../services/author.service";
import { AuthorDTO } from "../dto/author.dto";
import { Author } from "../models/author.model";
import { CustomError } from "../middlewares/errorHandler";

@Route("authors")
@Tags("Authors")
@Security("jwt", ["write", "read"])
export class AuthorController extends Controller {
  // Récupère tous les auteurs
  @Get("/")
  @Security("jwt", ["author:read"])
  public async getAllAuthors(): Promise<AuthorDTO[]> {
    return authorService.getAllAuthors();
  }

  // Récupère un auteur par ID
  @Get("{id}")
    @Security("jwt", ["author:read"])
  public async getAuthorById(@Path() id: number): Promise<AuthorDTO> {
    let author: Author | null = await authorService.getAuthorById(id);
    if (author === null) {
      let error: CustomError = new Error("Author not found");
      error.status = 404;
      throw error;
    } else {
      return author;
    }
  }

  // Crée un nouvel auteur
  @Post("/")
    @Security("jwt", ["author:create"])
  public async createAuthor(
    @Body() requestBody: AuthorDTO
  ): Promise<AuthorDTO> {
    const { firstName, lastName } = requestBody;
    if (!firstName || !lastName) {
      let error: CustomError = new Error(
        "First name and last name are required"
      );
      error.status = 400;
      throw error;
    }
    return authorService.createAuthor(firstName, lastName);
  }

  // Supprime un auteur par ID
  @Delete("{id}")
    @Security("jwt", ["author:delete"])
  public async deleteAuthor(@Path() id: number): Promise<void> {
    try {
      await authorService.deleteAuthor(id);
    } catch (SequelizeForeignKeyConstraintError) {
      let error: CustomError = new Error(
        "Cannot delete author with associated books"
      );
      error.status = 409;
      throw error;
    }
  }

  // Met à jour un auteur par ID
  @Patch("{id}")
  @Security("jwt", ["author:update"])
  public async updateAuthor(
    @Path() id: number,
    @Body() requestBody: AuthorDTO
  ): Promise<AuthorDTO> {
    const { firstName, lastName } = requestBody;
    if (!firstName || !lastName) {
      let error: CustomError = new Error(
        "First name and last name are required"
      );
      error.status = 400;
      throw error;
    }
    let author = await authorService.updateAuthor(id, firstName, lastName);

    if (author === null) {
      let error: CustomError = new Error("Author not found");
      error.status = 404;
      throw error;
    }

    return author;
  }
}
