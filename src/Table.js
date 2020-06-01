import React from 'react';

export default ({ className, rows}) => {
  let acc = new Map()
  rows.forEach(row => {
    for (const key in row) {
      const val = row[key]
      const accVal = acc[key] == null ? 0 : acc[key]
      acc[key] = isNaN(val) ? null : accVal + val
    }
  })

  // acc.keys() is returning an empty list
  // iterating over acc manually to extract keys
  let keys = []
  for (const key in acc){
    keys.push(key)
  }

  return (
    <table className={className}>
      <thead>
        <tr>
          <th> Index </th>
          {keys.map((d) => (
            <th> {d.toLocaleString()} </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr key={index}>
            <td> {index + 1} </td>
            {keys.map((d, i) => (
              <td key={i}>{row[d].toLocaleString()}</td>
            ))}
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <td> </td>
          {keys.map((d) => (
            <td> {(acc[d] != null) ? acc[d].toLocaleString() : 'N/A'} </td>
          ))}
        </tr>
      </tfoot>
    </table>
  );
};
