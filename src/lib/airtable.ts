import Airtable from 'airtable';

export class AirtableService {
  private base: Airtable.Base;
  private projectsTable: Airtable.Table;
  private commentsTable: Airtable.Table;
  private likesTable: Airtable.Table;

  constructor() {
    this.base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID || '');
    this.projectsTable = this.base('Projects');
    this.commentsTable = this.base('Comments');
    this.likesTable = this.base('Likes');
  }

  async getProjectById(id: string) {
    try {
      const record = await this.projectsTable.find(id);
      return this.formatProject(record);
    } catch (error) {
      console.error('Erreur lors de la récupération du projet:', error);
      throw error;
    }
  }

  async createComment({ projectId, content, author }: { projectId: string; content: string; author: string }) {
    try {
      const record = await this.commentsTable.create({
        projectId,
        content,
        author,
        createdAt: new Date().toISOString(),
      });
      return this.formatComment(record);
    } catch (error) {
      console.error('Erreur lors de la création du commentaire:', error);
      throw error;
    }
  }

  async getCommentsByProject(projectId: string) {
    try {
      const records = await this.commentsTable
        .select({
          filterByFormula: `{projectId} = '${projectId}'`,
          sort: [{ field: 'createdAt', direction: 'desc' }],
        })
        .all();
      return records.map(this.formatComment);
    } catch (error) {
      console.error('Erreur lors de la récupération des commentaires:', error);
      throw error;
    }
  }

  async toggleLike(projectId: string, userId: string) {
    try {
      const existingLike = await this.likesTable
        .select({
          filterByFormula: `AND({projectId} = '${projectId}', {userId} = '${userId}')`,
        })
        .firstPage();

      if (existingLike.length > 0) {
        await this.likesTable.destroy(existingLike[0].id);
        return { liked: false };
      } else {
        await this.likesTable.create({
          projectId,
          userId,
          createdAt: new Date().toISOString(),
        });
        return { liked: true };
      }
    } catch (error) {
      console.error('Erreur lors de la gestion du like:', error);
      throw error;
    }
  }

  async hasUserLiked(projectId: string, userId: string) {
    try {
      const records = await this.likesTable
        .select({
          filterByFormula: `AND({projectId} = '${projectId}', {userId} = '${userId}')`,
        })
        .firstPage();
      return records.length > 0;
    } catch (error) {
      console.error('Erreur lors de la vérification du like:', error);
      throw error;
    }
  }

  private formatProject(record: Airtable.Record) {
    return {
      id: record.id,
      name: record.get('name'),
      description: record.get('description'),
      technologies: record.get('technologies'),
      githubUrl: record.get('githubUrl'),
      demoUrl: record.get('demoUrl'),
      students: record.get('students'),
      likes: record.get('likes') || 0,
      createdAt: record.get('createdAt'),
      updatedAt: record.get('updatedAt'),
    };
  }

  private formatComment(record: Airtable.Record) {
    return {
      id: record.id,
      projectId: record.get('projectId'),
      content: record.get('content'),
      author: record.get('author'),
      createdAt: record.get('createdAt'),
    };
  }
} 