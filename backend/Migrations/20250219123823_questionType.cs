using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class questionType : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "QuestionType",
                table: "AnswerSnapshots",
                type: "longtext",
                nullable: false);

            migrationBuilder.CreateIndex(
                name: "IX_FilledForms_TemplateId",
                table: "FilledForms",
                column: "TemplateId");

            migrationBuilder.CreateIndex(
                name: "IX_AnswerSnapshots_QuestionId",
                table: "AnswerSnapshots",
                column: "QuestionId");

            migrationBuilder.AddForeignKey(
                name: "FK_AnswerSnapshots_Questions_QuestionId",
                table: "AnswerSnapshots",
                column: "QuestionId",
                principalTable: "Questions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_FilledForms_Templates_TemplateId",
                table: "FilledForms",
                column: "TemplateId",
                principalTable: "Templates",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AnswerSnapshots_Questions_QuestionId",
                table: "AnswerSnapshots");


            migrationBuilder.DropForeignKey(
                name: "FK_FilledForms_Templates_TemplateId",
                table: "FilledForms");

            migrationBuilder.DropIndex(
                name: "IX_FilledForms_TemplateId",
                table: "FilledForms");

            migrationBuilder.DropIndex(
                name: "IX_AnswerSnapshots_QuestionId",
                table: "AnswerSnapshots");

            migrationBuilder.DropColumn(
                name: "QuestionType",
                table: "AnswerSnapshots");

        }
    }
}
