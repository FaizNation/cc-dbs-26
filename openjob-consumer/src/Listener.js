const ApplicationService = require('./services/ApplicationService');
const JobService = require('./services/JobService');
const UserService = require('./services/UserService');

class Listener {
  constructor(mailSender) {
    this.mailSender = mailSender;
    this.applicationService = new ApplicationService();
    this.jobService = new JobService();
    this.userService = new UserService();

    this.listen = this.listen.bind(this);
  }

  async listen(message) {
    try {
      const { application_id } = JSON.parse(message.content.toString());

      console.log(`Processing application: ${application_id}`);

      const application = await this.applicationService.getApplicationById(application_id);

      const job = await this.jobService.getJobById(application.job_id);

      if (!job.owner_id) {
        console.log(`Job ${job.id} does not have an owner, skipping email.`);
        return;
      }

      const owner = await this.userService.getUserById(job.owner_id);
      const applicant = await this.userService.getUserById(application.user_id);

      const content = `
        Halo ${owner.name},
        
        Ada lamaran baru untuk lowongan "${job.title}".
        
        Detail Pelamar:
        - Nama: ${applicant.name}
        - Email: ${applicant.email}
        - Tanggal Lamaran: ${new Date().toISOString()}
        
        Silakan login ke platform OpenJob untuk meninjau lamaran ini.
      `;

      await this.mailSender.sendEmail(owner.email, content);
      console.log(`Email successfully sent to owner: ${owner.email}`);
    } catch (error) {
      console.error('Listener Error:', error.message);
    }
  }
}

module.exports = Listener;
