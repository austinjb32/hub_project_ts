
export const validate = (schema: { validate: (arg0: any) => { error: any; }; }) => (req: { body: any; }, res: { status: (arg0: number) => { (): any; new(): any; send: { (arg0: any): void; new(): any; }; }; }, next: () => void) => {
    const {
      error
    } = schema.validate(req.body);
    if (error) {
      res.status(422)
        .send(error.details[0].message);
    } else {
      next();
    }
  };