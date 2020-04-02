# coughona

## Getting started

- Clone repo - `git clone git@github.com:ranihorev/coughona.git`
- Run backend and frontend
  ```
  cd frontend
  yarn
  yarn start
  ```
- Run backend (requires AWS credentials to upload recording)
  ```
  cd backend
  yarn
  yarn start:watch
  ```

## Configuration

- Skip the Typeform section by setting `REACT_APP_SKIP_FORM=1` in `.env.development`
